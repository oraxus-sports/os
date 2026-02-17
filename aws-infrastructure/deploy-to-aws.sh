#!/bin/bash

# AWS Deployment Script for Microfrontends
# Usage: ./deploy-to-aws.sh [staging|production]

set -e

# Configuration
ENVIRONMENT=${1:-production}
STACK_NAME="sports-os-mfe-${ENVIRONMENT}"
AWS_REGION=${AWS_REGION:-us-east-1}

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying Microfrontends to AWS${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}\n"

# Check if stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION >/dev/null 2>&1; then
    echo -e "${YELLOW}Stack exists. Getting outputs...${NC}"
    
    # Get bucket names from CloudFormation outputs
    COMPONENTS_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`ComponentsBucketName`].OutputValue' \
        --output text)
    
    AUTH_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`AuthBucketName`].OutputValue' \
        --output text)
    
    PLATFORM_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`PlatformBucketName`].OutputValue' \
        --output text)
    
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
        --output text)
    
    COMPONENTS_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`ComponentsURL`].OutputValue' \
        --output text)
    
    AUTH_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`AuthURL`].OutputValue' \
        --output text)
    
    PLATFORM_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`PlatformURL`].OutputValue' \
        --output text)
else
    echo -e "${RED}Stack does not exist. Please run CloudFormation template first.${NC}"
    echo -e "${YELLOW}See aws-infrastructure/setup-guide.md for instructions.${NC}"
    exit 1
fi

echo -e "${GREEN}Configuration:${NC}"
echo "Components Bucket: $COMPONENTS_BUCKET"
echo "Auth Bucket: $AUTH_BUCKET"
echo "Platform Bucket: $PLATFORM_BUCKET"
echo "Distribution ID: $DISTRIBUTION_ID"
echo ""
echo "Components URL: $COMPONENTS_URL"
echo "Auth URL: $AUTH_URL"
echo "Platform URL: $PLATFORM_URL"
echo ""

# Build all microfrontends
echo -e "${BLUE}📦 Building Components...${NC}"
cd components
PUBLIC_PATH="${COMPONENTS_URL}/" npm run build
cd ..

echo -e "${BLUE}📦 Building Auth...${NC}"
cd auth
PUBLIC_PATH="${AUTH_URL}/" npm run build
cd ..

echo -e "${BLUE}📦 Building Platform...${NC}"
cd platform
COMPONENTS_URL="$COMPONENTS_URL" \
AUTH_URL="$AUTH_URL" \
PUBLIC_PATH="${PLATFORM_URL}/" \
npm run build
cd ..

# Deploy to S3
echo -e "${BLUE}☁️  Deploying Components to S3...${NC}"
aws s3 sync components/dist/ s3://${COMPONENTS_BUCKET}/ \
    --delete \
    --region $AWS_REGION \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "remoteEntry.js"

# Upload remoteEntry.js with short cache
aws s3 cp components/dist/remoteEntry.js s3://${COMPONENTS_BUCKET}/remoteEntry.js \
    --region $AWS_REGION \
    --cache-control "public, max-age=300" \
    --content-type "application/javascript"

echo -e "${BLUE}☁️  Deploying Auth to S3...${NC}"
aws s3 sync auth/dist/ s3://${AUTH_BUCKET}/ \
    --delete \
    --region $AWS_REGION \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "remoteEntry.js"

aws s3 cp auth/dist/remoteEntry.js s3://${AUTH_BUCKET}/remoteEntry.js \
    --region $AWS_REGION \
    --cache-control "public, max-age=300" \
    --content-type "application/javascript"

echo -e "${BLUE}☁️  Deploying Platform to S3...${NC}"
aws s3 sync platform/dist/ s3://${PLATFORM_BUCKET}/ \
    --delete \
    --region $AWS_REGION \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html"

# Upload index.html with no-cache
aws s3 cp platform/dist/index.html s3://${PLATFORM_BUCKET}/index.html \
    --region $AWS_REGION \
    --cache-control "no-cache" \
    --content-type "text/html"

# Invalidate CloudFront cache
echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --region $AWS_REGION

echo -e "${GREEN}✅ Deployment Complete!${NC}\n"
echo -e "${GREEN}Your application is available at:${NC}"
echo -e "${BLUE}$PLATFORM_URL${NC}\n"

echo -e "${YELLOW}Note: CloudFront cache invalidation may take 5-10 minutes to propagate.${NC}"
