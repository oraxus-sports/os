# AWS Deployment Configuration

## Production Architecture

All microfrontends deployed to AWS under a single infrastructure:

```
CloudFront Distribution (app.yourdomain.com)
├── /components/*  → S3: components bucket
├── /auth/*        → S3: auth bucket  
└── /*             → S3: platform bucket

OR with subdomains:
components.app.yourdomain.com → S3: components bucket
auth.app.yourdomain.com       → S3: auth bucket
app.yourdomain.com            → S3: platform bucket
```

## Environment Strategy

### Development (Local)
```bash
npm start  # Each microfrontend runs separately
# Components: http://localhost:3001
# Auth:       http://localhost:3002
# Platform:   http://localhost:3000
```

### Production (AWS)
```bash
npm run build:prod  # Build all with AWS URLs
# Components: https://app.yourdomain.com/components/
# Auth:       https://app.yourdomain.com/auth/
# Platform:   https://app.yourdomain.com/
```

## Quick Setup

### Option 1: Single Domain with Paths

**Best for**: Single CloudFront distribution, simpler setup

```bash
# Production URLs
COMPONENTS_URL=https://app.yourdomain.com/components
AUTH_URL=https://app.yourdomain.com/auth
PLATFORM_URL=https://app.yourdomain.com

# Build
cd ui-plugins
COMPONENTS_URL=https://app.yourdomain.com/components \
AUTH_URL=https://app.yourdomain.com/auth \
PLATFORM_URL=https://app.yourdomain.com \
npm run build:prod

# Deploy to S3
aws s3 sync components/dist/ s3://your-bucket/components/ --delete
aws s3 sync auth/dist/ s3://your-bucket/auth/ --delete
aws s3 sync platform/dist/ s3://your-bucket/ --delete
```

### Option 2: Subdomains

**Best for**: Separate S3 buckets, clearer separation

```bash
# Production URLs
COMPONENTS_URL=https://components.app.yourdomain.com
AUTH_URL=https://auth.app.yourdomain.com
PLATFORM_URL=https://app.yourdomain.com

# Build
COMPONENTS_URL=https://components.app.yourdomain.com \
AUTH_URL=https://auth.app.yourdomain.com \
PLATFORM_URL=https://app.yourdomain.com \
npm run build:prod

# Deploy to separate S3 buckets
aws s3 sync components/dist/ s3://components-bucket/ --delete
aws s3 sync auth/dist/ s3://auth-bucket/ --delete
aws s3 sync platform/dist/ s3://platform-bucket/ --delete
```

## Infrastructure as Code

See:
- `aws-infrastructure/cloudformation-template.yml` - Complete AWS stack
- `aws-infrastructure/terraform/` - Terraform configuration
- `aws-infrastructure/setup-guide.md` - Step-by-step AWS setup
