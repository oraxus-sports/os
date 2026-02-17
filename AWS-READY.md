# ✅ AWS Deployment - Ready to Use

## What You Have Now

Your microfrontend project is configured for **AWS deployment** with:

✅ **Separate development** - Each app runs independently on localhost  
✅ **Unified production** - All apps deploy together to AWS  
✅ **One-command deployment** - `npm run deploy:aws`  
✅ **Automated CI/CD** - GitHub Actions with CloudFormation integration  
✅ **Infrastructure as Code** - Complete CloudFormation template  

---

## 📁 AWS Files Created

### Infrastructure
- ✅ `aws-infrastructure/cloudformation-template.yml` - Complete AWS stack (S3, CloudFront, Route53)
- ✅ `aws-infrastructure/deploy-to-aws.sh` - Automated deployment script
- ✅ `aws-infrastructure/setup-guide.md` - Step-by-step AWS setup

### Documentation
- ✅ `AWS-QUICKSTART.md` - **Your quickstart guide**
- ✅ `AWS-DEPLOYMENT.md` - Overview and architecture
- ✅ Updated `.github/workflows/deploy-all.yml` - GitHub Actions for AWS

### Build Scripts
- ✅ Updated `package.json` with `deploy:aws` commands

---

## 🎯 Your Deployment Strategy

### Development Environment
```bash
cd ui-plugins
npm run start:all

# Each app runs independently:
# - Components: http://localhost:3001
# - Auth:       http://localhost:3002
# - Platform:   http://localhost:3000
```

### Production Environment
```bash
# One command deploys all three to AWS:
npm run deploy:aws

# All apps deployed to same infrastructure:
# - app.yourdomain.com/components/
# - app.yourdomain.com/auth/
# - app.yourdomain.com/
```

---

## 🚀 Getting Started

### Step 1: One-Time AWS Setup (30 minutes)

Follow [AWS-QUICKSTART.md](AWS-QUICKSTART.md):

1. **Create ACM certificate** for your domain
2. **Deploy CloudFormation stack** (creates S3, CloudFront, etc.)
3. **Configure DNS** to point to CloudFront

```bash
# Example:
aws cloudformation create-stack \
    --stack-name sports-os-mfe-production \
    --template-body file://aws-infrastructure/cloudformation-template.yml \
    --parameters \
        ParameterKey=DomainName,ParameterValue=app.yourdomain.com \
        ParameterKey=CertificateArn,ParameterValue=YOUR_CERT_ARN \
        ParameterKey=DeploymentType,ParameterValue=single-domain \
    --region us-east-1
```

### Step 2: Deploy Your Apps (Every Release)

```bash
cd ui-plugins
npm run deploy:aws
```

That's it! The script:
- ✅ Gets AWS infrastructure details automatically
- ✅ Builds all three apps with correct URLs
- ✅ Uploads to S3 with proper cache headers
- ✅ Invalidates CloudFront cache
- ✅ Shows deployment status

---

## 🔄 Automated CI/CD

### GitHub Actions (Already Configured!)

Your `.github/workflows/deploy-all.yml` is ready for AWS:

1. **Push to repository**:
   ```bash
   git push origin main
   ```

2. **GitHub Actions automatically**:
   - Gets infrastructure from CloudFormation
   - Builds all microfrontends
   - Deploys to S3
   - Invalidates CloudFront
   - Notifies you when complete

**Setup**: Add AWS credentials to GitHub secrets (see [setup-guide.md](aws-infrastructure/setup-guide.md#configuration-for-github-actions))

---

## 📊 Architecture

### Single Domain (Recommended)

```
┌─────────────────────────────────────────┐
│  CloudFront Distribution                │
│  (app.yourdomain.com)                   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ /components/* → S3 Components     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ /auth/* → S3 Auth                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ /* → S3 Platform                  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Benefits**:
- ✅ Single CloudFront distribution
- ✅ Single SSL certificate
- ✅ Simpler DNS setup
- ✅ Lower cost

---

## 💰 Cost Estimate

Based on AWS pricing:

| Traffic | Monthly Cost |
|---------|--------------|
| **Small** (< 10K visitors) | $7-13 |
| **Medium** (100K visitors) | $26-51 |
| **Large** (1M visitors) | $182-302 |

Main costs: CloudFront data transfer and requests.

---

## 📝 Common Commands

```bash
# Development
npm run start:all              # Start all apps locally

# Production Deployment
npm run deploy:aws             # Deploy to production
npm run deploy:aws:staging     # Deploy to staging

# Manual Operations
npm run build:all              # Build without deploying

# AWS Information
aws cloudformation describe-stacks \
    --stack-name sports-os-mfe-production \
    --query 'Stacks[0].Outputs' \
    --output table
```

---

## 🔧 What CloudFormation Creates

The CloudFormation template creates:

- ✅ **3 S3 buckets** (components, auth, platform)
- ✅ **CloudFront distribution** with HTTPS
- ✅ **Origin Access Identity** for S3 security
- ✅ **Bucket policies** for CloudFront access
- ✅ **CORS configuration** for Module Federation
- ✅ **Cache behaviors** optimized for microfrontends

All with:
- ✅ Proper cache headers (remoteEntry.js = 5min, assets = 1year)
- ✅ CORS enabled for remote microfrontends
- ✅ SPA routing support (404 → index.html)
- ✅ HTTPS enforced
- ✅ Gzip compression

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[AWS-QUICKSTART.md](AWS-QUICKSTART.md)** | **Quick start guide** |
| [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) | Overview |
| [aws-infrastructure/setup-guide.md](aws-infrastructure/setup-guide.md) | Detailed setup |
| [aws-infrastructure/cloudformation-template.yml](aws-infrastructure/cloudformation-template.yml) | Infrastructure code |
| [CI-CD-README.md](CI-CD-README.md) | CI/CD options |

---

## ⚡ Quick Start Checklist

- [ ] Create ACM certificate for your domain
- [ ] Deploy CloudFormation stack
- [ ] Configure DNS to point to CloudFront
- [ ] Run `npm run deploy:aws`
- [ ] Access your app at your domain
- [ ] (Optional) Set up GitHub Actions for automated deployment

**Time to deploy**: ~30 minutes for first-time setup, then 2-3 minutes per deployment.

---

## 🆘 Need Help?

### Common Issues

**"Stack does not exist"**  
→ Run CloudFormation template first (see [setup-guide.md](aws-infrastructure/setup-guide.md))

**"Certificate validation pending"**  
→ Add DNS validation records from ACM console

**"Can't access app after deployment"**  
→ Wait 5-10 minutes for CloudFront invalidation

**"remoteEntry.js not loading"**  
→ CORS is configured automatically by CloudFormation

### Support

1. Check [AWS-QUICKSTART.md](AWS-QUICKSTART.md)
2. Review CloudFormation outputs
3. Check CloudFront distribution status
4. Verify DNS is pointing to CloudFront

---

## 🎉 You're Ready!

Your setup:
- ✅ Webpack configs support environment-based URLs
- ✅ CloudFormation template ready to deploy
- ✅ Deployment script automated
- ✅ GitHub Actions configured
- ✅ Complete documentation

**Next step**: Follow [AWS-QUICKSTART.md](AWS-QUICKSTART.md) to deploy! 🚀

---

## Development vs Production Summary

| Aspect | Development | Production |
|--------|-------------|------------|
| **How to run** | `npm run start:all` | `npm run deploy:aws` |
| **Components URL** | `http://localhost:3001` | `https://app.yourdomain.com/components` |
| **Auth URL** | `http://localhost:3002` | `https://app.yourdomain.com/auth` |
| **Platform URL** | `http://localhost:3000` | `https://app.yourdomain.com` |
| **Infrastructure** | Local dev servers | AWS S3 + CloudFront |
| **Deployment** | N/A | Single command or git push |
| **Cost** | Free | ~$7-300/month based on traffic |
| **HTTPS** | No | Yes (via ACM) |
| **Custom domain** | No | Yes |
| **CDN** | No | CloudFront global CDN |

Perfect setup for your requirement: **separate in dev, together in production**! 🎯
