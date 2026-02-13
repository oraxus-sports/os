# AWS Infrastructure Setup Guide

## Prerequisites

1. **AWS Account** with admin access
2. **AWS CLI** installed and configured
3. **Domain name** (optional but recommended)
4. **ACM Certificate** (if using custom domain)

## Step-by-Step Setup

### Step 1: Create ACM Certificate (If using custom domain)

```bash
# Request certificate in us-east-1 (required for CloudFront)
aws acm request-certificate \
    --domain-name app.yourdomain.com \
    --subject-alternative-names "*.app.yourdomain.com" \
    --validation-method DNS \
    --region us-east-1

# Note the CertificateArn from the output
# Add DNS validation records in your DNS provider
# Wait for certificate to be issued (STATUS: ISSUED)
```

### Step 2: Deploy CloudFormation Stack

#### Option A: Single Domain with Paths (Recommended)

Deploy all microfrontends under one domain:
- `app.yourdomain.com/components/`
- `app.yourdomain.com/auth/`
- `app.yourdomain.com/`

```bash
aws cloudformation create-stack \
    --stack-name sports-os-mfe-production \
    --template-body file://aws-infrastructure/cloudformation-template.yml \
    --parameters \
        ParameterKey=DomainName,ParameterValue=app.yourdomain.com \
        ParameterKey=CertificateArn,ParameterValue=arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID \
        ParameterKey=DeploymentType,ParameterValue=single-domain \
    --region us-east-1

# Wait for stack creation (10-15 minutes)
aws cloudformation wait stack-create-complete \
    --stack-name sports-os-mfe-production \
    --region us-east-1
```

#### Option B: Subdomains

Deploy each microfrontend to its own subdomain:
- `components.app.yourdomain.com`
- `auth.app.yourdomain.com`
- `app.yourdomain.com`

```bash
aws cloudformation create-stack \
    --stack-name sports-os-mfe-production \
    --template-body file://aws-infrastructure/cloudformation-template.yml \
    --parameters \
        ParameterKey=DomainName,ParameterValue=app.yourdomain.com \
        ParameterKey=CertificateArn,ParameterValue=arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID \
        ParameterKey=DeploymentType,ParameterValue=subdomains \
    --region us-east-1

aws cloudformation wait stack-create-complete \
    --stack-name sports-os-mfe-production \
    --region us-east-1
```

### Step 3: Get Stack Outputs

```bash
# Get all outputs
aws cloudformation describe-stacks \
    --stack-name sports-os-mfe-production \
    --region us-east-1 \
    --query 'Stacks[0].Outputs'

# Important outputs:
# - ComponentsBucketName
# - AuthBucketName
# - PlatformBucketName
# - DistributionId
# - DistributionDomain
# - ComponentsURL
# - AuthURL
# - PlatformURL
```

### Step 4: Configure DNS

Point your domain to CloudFront:

```bash
# Get CloudFront distribution domain
CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name sports-os-mfe-production \
    --region us-east-1 \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionDomain`].OutputValue' \
    --output text)

echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
```

#### For Single Domain:
Create DNS record in Route53 or your DNS provider:
```
Type: A (Alias)
Name: app.yourdomain.com
Value: [CloudFront Distribution Domain]
```

#### For Subdomains:
Create DNS records for each:
```
Type: A (Alias)
Name: components.app.yourdomain.com
Value: [Components CloudFront Domain]

Type: A (Alias)
Name: auth.app.yourdomain.com
Value: [Auth CloudFront Domain]

Type: A (Alias)
Name: app.yourdomain.com
Value: [Platform CloudFront Domain]
```

### Step 5: Build and Deploy Your Apps

Use the automated deployment script:

```bash
cd ui-plugins
chmod +x aws-infrastructure/deploy-to-aws.sh
./aws-infrastructure/deploy-to-aws.sh production
```

Or manually:

```bash
# Get URLs from CloudFormation
COMPONENTS_URL=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`ComponentsURL`].OutputValue' --output text)
AUTH_URL=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`AuthURL`].OutputValue' --output text)
PLATFORM_URL=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`PlatformURL`].OutputValue' --output text)

# Build
COMPONENTS_URL=$COMPONENTS_URL \
AUTH_URL=$AUTH_URL \
PLATFORM_URL=$PLATFORM_URL \
npm run build:prod

# Deploy
COMPONENTS_BUCKET=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`ComponentsBucketName`].OutputValue' --output text)
AUTH_BUCKET=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`AuthBucketName`].OutputValue' --output text)
PLATFORM_BUCKET=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`PlatformBucketName`].OutputValue' --output text)

aws s3 sync components/dist/ s3://${COMPONENTS_BUCKET}/ --delete
aws s3 sync auth/dist/ s3://${AUTH_BUCKET}/ --delete
aws s3 sync platform/dist/ s3://${PLATFORM_BUCKET}/ --delete
```

## Configuration for GitHub Actions

Update GitHub secrets with your AWS infrastructure:

```bash
# Get values from CloudFormation outputs
aws cloudformation describe-stacks \
    --stack-name sports-os-mfe-production \
    --region us-east-1 \
    --query 'Stacks[0].Outputs' \
    --output table
```

Add to GitHub Secrets:
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# From CloudFormation outputs:
S3_BUCKET_COMPONENTS_PROD=[ComponentsBucketName]
S3_BUCKET_AUTH_PROD=[AuthBucketName]
S3_BUCKET_PLATFORM_PROD=[PlatformBucketName]
CLOUDFRONT_DISTRIBUTION_ID_COMPONENTS_PROD=[DistributionId]
CLOUDFRONT_DISTRIBUTION_ID_AUTH_PROD=[DistributionId if subdomains]
CLOUDFRONT_DISTRIBUTION_ID_PLATFORM_PROD=[DistributionId]
COMPONENTS_URL_PROD=[ComponentsURL]
AUTH_URL_PROD=[AuthURL]
PLATFORM_URL_PROD=[PlatformURL]
```

## Development vs Production

### Development (Local)
```bash
# Run separately
cd ui-plugins/components && npm start  # Port 3001
cd ui-plugins/auth && npm start        # Port 3002
cd ui-plugins/platform && npm start    # Port 3000
```

### Production (AWS)
```bash
# Deploy together
cd ui-plugins
./aws-infrastructure/deploy-to-aws.sh production
```

## Cost Estimation

### Monthly AWS Costs (approximate)

**Small App (< 10,000 visitors/month)**:
- S3 Storage: $0.50
- CloudFront Data Transfer: $5-10
- CloudFront Requests: $1-2
- **Total: ~$7-13/month**

**Medium App (100,000 visitors/month)**:
- S3 Storage: $1
- CloudFront Data Transfer: $20-40
- CloudFront Requests: $5-10
- **Total: ~$26-51/month**

**Large App (1M visitors/month)**:
- S3 Storage: $2
- CloudFront Data Transfer: $150-250
- CloudFront Requests: $30-50
- **Total: ~$182-302/month**

## Monitoring

### CloudWatch Alarms

```bash
# Create alarm for 4xx errors
aws cloudwatch put-metric-alarm \
    --alarm-name mfe-4xx-errors \
    --alarm-description "Alert on 4xx errors" \
    --metric-name 4xxErrorRate \
    --namespace AWS/CloudFront \
    --statistic Average \
    --period 300 \
    --evaluation-periods 2 \
    --threshold 5 \
    --comparison-operator GreaterThanThreshold
```

### View Logs

CloudFront access logs (optional):
```bash
# Enable in CloudFormation template or console
# Logs will be delivered to S3 bucket
```

## Cleanup (Delete Resources)

```bash
# Empty S3 buckets first
aws s3 rm s3://$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --query 'Stacks[0].Outputs[?OutputKey==`ComponentsBucketName`].OutputValue' --output text)/ --recursive
aws s3 rm s3://$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --query 'Stacks[0].Outputs[?OutputKey==`AuthBucketName`].OutputValue' --output text)/ --recursive
aws s3 rm s3://$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --query 'Stacks[0].Outputs[?OutputKey==`PlatformBucketName`].OutputValue' --output text)/ --recursive

# Delete stack
aws cloudformation delete-stack \
    --stack-name sports-os-mfe-production \
    --region us-east-1
```

## Troubleshooting

### Issue: CloudFormation fails with certificate error
**Solution**: Ensure ACM certificate is in `us-east-1` region and validated.

### Issue: 403 Forbidden from CloudFront
**Solution**: Check S3 bucket policy allows CloudFront OAI access.

### Issue: remoteEntry.js not loading
**Solution**: Verify CORS headers in S3 bucket configuration.

### Issue: Old version still showing
**Solution**: Invalidate CloudFront cache or wait 5-10 minutes.

## Next Steps

1. ✅ Deploy infrastructure with CloudFormation
2. ✅ Configure DNS
3. ✅ Deploy your applications
4. ✅ Set up GitHub Actions for automated deployment
5. ✅ Configure monitoring and alerts
6. ✅ Set up staging environment (repeat steps with different stack name)
