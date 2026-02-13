# Production Deployment Guide for Microfrontends

## Architecture Overview

This project uses **Webpack Module Federation** to create independently deployable microfrontends:

- **Platform (Host)** - Main application that consumes remote modules
- **Components** - Shared UI components (Button, Card, etc.)
- **Auth** - Authentication module (Login, SignUp, AuthProvider)

## Production Build Process

### 1. Build Each Microfrontend Separately

Each microfrontend must be built and deployed independently:

```bash
# Build Components Microfrontend
cd ui-plugins/components
PUBLIC_PATH=https://components.yourdomain.com/ npm run build

# Build Auth Microfrontend
cd ui-plugins/auth
PUBLIC_PATH=https://auth.yourdomain.com/ npm run build

# Build Platform (Host) - Build this LAST
cd ui-plugins/platform
COMPONENTS_URL=https://components.yourdomain.com \
AUTH_URL=https://auth.yourdomain.com \
PUBLIC_PATH=https://platform.yourdomain.com/ \
npm run build
```

### 2. Deploy to Your Hosting Provider

Each microfrontend's `dist/` folder should be deployed to its respective URL.

#### Option A: AWS S3 + CloudFront

```bash
# Deploy Components
aws s3 sync components/dist/ s3://your-components-bucket/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# Deploy Auth
aws s3 sync auth/dist/ s3://your-auth-bucket/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# Deploy Platform
aws s3 sync platform/dist/ s3://your-platform-bucket/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Option B: Netlify

```bash
# Each microfrontend can be deployed separately
cd components && netlify deploy --prod --dir=dist
cd auth && netlify deploy --prod --dir=dist
cd platform && netlify deploy --prod --dir=dist
```

#### Option C: Vercel

```json
// vercel.json in each microfrontend
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

#### Option D: Docker/Kubernetes

Create Dockerfile for each microfrontend:

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Environment-Specific Builds

Create environment-specific build scripts in `package.json`:

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:staging": "webpack --mode production --env staging",
    "build:prod": "webpack --mode production --env production"
  }
}
```

Create `.env.staging` and `.env.production` files:

```bash
# .env.production
COMPONENTS_URL=https://components.yourdomain.com
AUTH_URL=https://auth.yourdomain.com
PUBLIC_PATH=https://platform.yourdomain.com/

# .env.staging
COMPONENTS_URL=https://components-staging.yourdomain.com
AUTH_URL=https://auth-staging.yourdomain.com
PUBLIC_PATH=https://platform-staging.yourdomain.com/
```

### 4. CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy-components.yml`:

```yaml
name: Deploy Components Microfrontend

on:
  push:
    branches: [main]
    paths:
      - 'ui-plugins/components/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: ./ui-plugins/components
        run: npm ci
        
      - name: Build
        working-directory: ./ui-plugins/components
        env:
          PUBLIC_PATH: https://components.yourdomain.com/
        run: npm run build
        
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: your-components-bucket
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: ./ui-plugins/components/dist
```

Repeat similar workflows for `auth` and `platform`.

## Important Production Considerations

### 1. CORS Configuration

Ensure your server/CDN allows cross-origin requests:

**Nginx example:**
```nginx
location / {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type";
}
```

**S3 Bucket CORS:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 2. Cache Strategy

- **remoteEntry.js**: Short cache (5-10 minutes) or no-cache
- **Other assets**: Long cache with content hash

**CloudFront Cache Behavior:**
- remoteEntry.js: TTL = 300 seconds (5 min)
- *.js, *.css: TTL = 31536000 seconds (1 year)

**Nginx Cache Headers:**
```nginx
location = /remoteEntry.js {
    add_header Cache-Control "public, max-age=300";
}

location ~* \.(js|css)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 3. Versioning Strategy

For controlled deployments, version your remoteEntry.js:

```javascript
// In platform/webpack.config.js
remotes: {
  remoteComponents: `remoteComponents@${COMPONENTS_URL}/v1/remoteEntry.js`,
  authApp: `authApp@${AUTH_URL}/v1/remoteEntry.js`,
}
```

### 4. Deployment Order

**CRITICAL:** Always deploy in this order:
1. Deploy remote microfrontends first (components, auth)
2. Deploy host application last (platform)

This ensures the host never points to non-existent remotes.

### 5. Rollback Strategy

Keep previous versions available:
```
s3://bucket/
  v1.0.0/
    remoteEntry.js
    main.abc123.js
  v1.0.1/
    remoteEntry.js
    main.def456.js
  current/ -> symlink to v1.0.1
```

### 6. Health Checks

Create a simple health check endpoint for each microfrontend:

```javascript
// In each exposed module
export const health = () => ({ status: 'ok', version: '1.0.0' });
```

## Testing Production Builds Locally

Serve production builds locally to test:

```bash
# Build all microfrontends
cd components && npm run build
cd ../auth && npm run build
cd ../platform && npm run build

# Serve with a simple HTTP server
cd components/dist && npx serve -p 3001 &
cd ../../auth/dist && npx serve -p 3002 &
cd ../../platform/dist && npx serve -p 3000 &
```

Or use the included test script:

```bash
# From ui-plugins directory
npm run serve:all
```

## Monitoring & Debugging

### Module Federation Errors

Common production issues:

1. **404 on remoteEntry.js**: Wrong PUBLIC_PATH or deployment failed
2. **Shared dependency version mismatch**: Check webpack shared config
3. **CORS errors**: Configure server headers properly
4. **Chunk loading failed**: Check cache headers and content hashing

### Debug Mode

Enable detailed logging in development:

```javascript
// In webpack.config.js
stats: {
  modules: true,
  chunks: true,
  chunkModules: true,
}
```

## Security Considerations

1. **CSP Headers**: Add Content Security Policy for remote modules
2. **SRI (Subresource Integrity)**: Consider for critical remotes
3. **Authentication**: Ensure auth tokens work across subdomains
4. **HTTPS**: Always use HTTPS in production

## Performance Optimization

1. **Code Splitting**: Already handled by Module Federation
2. **Lazy Loading**: Load remotes on-demand when possible
3. **Preloading**: Use `<link rel="preload">` for critical remotes
4. **Compression**: Enable gzip/brotli on your CDN

```javascript
// Lazy load remotes
const LazyButton = React.lazy(() => import('remoteComponents/Button'));
```

## Troubleshooting

### Issue: Module not found in production

**Solution**: Verify PUBLIC_PATH matches deployment URL exactly (with trailing slash).

### Issue: Shared dependencies duplicated

**Solution**: Ensure identical version ranges in all package.json files.

### Issue: remoteEntry.js cached with old version

**Solution**: Implement cache-busting or version URLs.

## Example Production URLs

```
Platform (Host):     https://app.yourdomain.com
Components Remote:   https://mfe-components.yourdomain.com
Auth Remote:         https://mfe-auth.yourdomain.com
```

Or using CDN paths:
```
Platform:    https://cdn.yourdomain.com/platform/
Components:  https://cdn.yourdomain.com/components/
Auth:        https://cdn.yourdomain.com/auth/
```

## Next Steps

1. Set up your hosting infrastructure
2. Configure environment variables for each environment
3. Create CI/CD pipelines for automated deployments
4. Implement monitoring and error tracking (e.g., Sentry)
5. Set up feature flags for gradual rollouts
6. Document your specific deployment URLs for your team
