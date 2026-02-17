# AWS Deployment - Quick Start

## Your Setup

✅ **Development**: All microfrontends run separately on localhost  
✅ **Production**: All microfrontends deployed together to AWS

## Development Workflow

```bash
# Start all apps locally (each on different port)
cd ui-plugins
npm run start:all

# Access:
# Platform:   http://localhost:3000
# Auth:       http://localhost:3002  
# Components: http://localhost:3001
```

Each microfrontend runs independently with hot reload during development.

---

## Production Deployment to AWS

### One-Time Setup (30 minutes)

#### 1. Create ACM Certificate (for HTTPS)

```bash
# Request certificate in us-east-1
aws acm request-certificate \
    --domain-name app.yourdomain.com \
    --subject-alternative-names "*.app.yourdomain.com" \
    --validation-method DNS \
    --region us-east-1

# Add DNS validation records (you'll get these from ACM)
# Wait for validation (5-10 minutes)
```

#### 2. Deploy CloudFormation Stack

Choose your architecture:

**Option A: Single Domain (Recommended)**
All apps under one domain:
- `app.yourdomain.com/components/`
- `app.yourdomain.com/auth/`
- `app.yourdomain.com/`

```bash
cd ui-plugins

aws cloudformation create-stack \
    --stack-name sports-os-mfe-production \
    --template-body file://aws-infrastructure/cloudformation-template.yml \
    --parameters \
        ParameterKey=DomainName,ParameterValue=app.yourdomain.com \
        ParameterKey=CertificateArn,ParameterValue=YOUR_CERT_ARN \
        ParameterKey=DeploymentType,ParameterValue=single-domain \
    --region us-east-1

# Wait for completion
aws cloudformation wait stack-create-complete \
    --stack-name sports-os-mfe-production \
    --region us-east-1
```

**Option B: Subdomains**
Each app on its own subdomain:
- `components.app.yourdomain.com`
- `auth.app.yourdomain.com`
- `app.yourdomain.com`

```bash
# Same command but change DeploymentType to 'subdomains'
ParameterKey=DeploymentType,ParameterValue=subdomains
```

#### 3. Configure DNS

Point your domain to CloudFront:

```bash
# Get CloudFront domain
aws cloudformation describe-stacks \
    --stack-name sports-os-mfe-production \
    --region us-east-1 \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionDomain`].OutputValue' \
    --output text
```

In Route 53 or your DNS provider:
```
Type: A (Alias)
Name: app.yourdomain.com
Value: [CloudFront Domain from above]
```

---

### Deploy Your Apps (Every Release)

#### Option 1: Automated Script (Easiest)

```bash
cd ui-plugins
chmod +x aws-infrastructure/deploy-to-aws.sh

# Deploy to production
npm run deploy:aws

# Or deploy to staging
npm run deploy:aws:staging
```

The script automatically:
- ✅ Gets bucket names from CloudFormation
- ✅ Builds all three microfrontends with correct URLs
- ✅ Uploads to S3 with proper cache headers
- ✅ Invalidates CloudFront cache
- ✅ Shows deployment summary

#### Option 2: GitHub Actions (Fully Automated)

Push code to trigger automatic deployment:

```bash
git add .
git commit -m "Update feature"
git push origin main  # Auto-deploys to production
```

GitHub Actions will:
1. Get infrastructure details from CloudFormation
2. Build all microfrontends
3. Deploy to S3
4. Invalidate CloudFront
5. Notify you when complete

**Setup**: See [aws-infrastructure/setup-guide.md](aws-infrastructure/setup-guide.md#configuration-for-github-actions)

---

## Architecture

### Development Environment
```
┌─────────────────────────────────────┐
│  Your Laptop                        │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Components (localhost:3001)  │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Auth (localhost:3002)        │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Platform (localhost:3000)    │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Production Environment (AWS)
```
┌─────────────────────────────────────────────────┐
│  app.yourdomain.com (CloudFront)                │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ /components/* → S3 Components Bucket      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ /auth/* → S3 Auth Bucket                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ /* → S3 Platform Bucket                   │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## Cost Estimate

**Typical monthly cost for production**:

- **Small app** (< 10K visitors): ~$7-13/month
- **Medium app** (100K visitors): ~$26-51/month  
- **Large app** (1M visitors): ~$182-302/month

Main costs: CloudFront data transfer and requests

---

## Common Commands

```bash
# Development
npm run start:all              # Start all apps locally

# Production Build & Deploy
npm run deploy:aws             # Build and deploy to production
npm run deploy:aws:staging     # Build and deploy to staging

# Manual build only (no deploy)
npm run build:all              # Build with default settings

# View CloudFormation outputs
aws cloudformation describe-stacks \
    --stack-name sports-os-mfe-production \
    --query 'Stacks[0].Outputs' \
    --output table

# Invalidate CloudFront cache manually
DIST_ID=$(aws cloudformation describe-stacks --stack-name sports-os-mfe-production --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

---

## Troubleshooting

### Can't access app after deployment

**Wait 5-10 minutes** for CloudFront invalidation to complete.

### Getting 403 errors

Check S3 bucket policies allow CloudFront access:
```bash
aws s3api get-bucket-policy --bucket YOUR_BUCKET_NAME
```

### remoteEntry.js not loading

Verify CORS is enabled on S3 buckets (CloudFormation template handles this automatically).

### Old version still showing

Clear browser cache (Ctrl+Shift+R) or wait for CloudFront TTL to expire.

---

## Documentation

- 📘 [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) - Overview
- 📕 [aws-infrastructure/setup-guide.md](aws-infrastructure/setup-guide.md) - Detailed AWS setup
- 📗 [aws-infrastructure/cloudformation-template.yml](aws-infrastructure/cloudformation-template.yml) - Infrastructure code
- 📄 [CI-CD-README.md](CI-CD-README.md) - Automated CI/CD setup

---

## Your Workflow

### During Development
```bash
# Code changes
npm run start:all
# Test at localhost:3000
```

### Deploy to Production
```bash
# One command deployment
npm run deploy:aws

# Or push to GitHub for automatic deployment
git push origin main
```

That's it! Your apps are deployed to AWS and accessible at your domain. 🚀
