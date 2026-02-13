# Production Build Setup - Quick Reference

## What Changed

All webpack configurations now support **environment-based URLs** instead of hardcoded localhost:

- ✅ Dynamic remote URLs based on environment
- ✅ Production build optimization (content hashing, minification)
- ✅ Proper cache headers configuration  
- ✅ CORS support for Module Federation
- ✅ Build scripts for all environments

## Files Modified

1. **platform/webpack.config.js** - Environment-aware host configuration
2. **components/webpack.config.js** - Dynamic PUBLIC_PATH for remote
3. **auth/webpack.config.js** - Dynamic PUBLIC_PATH for remote

## New Files Created

1. **package.json** - Root package with multi-app scripts
2. **scripts/build-production.js** - Automated production build
3. **scripts/build-production.sh** - Bash version of build script
4. **.env.example** - Environment variable template
5. **DEPLOYMENT.md** - Complete deployment guide
6. **deployment-examples/** - Nginx configs, Docker setup

## Quick Commands

### Development (Local)
```bash
# Start all apps (uses localhost URLs automatically)
npm run start:all

# Or start individually
cd components && npm start  # Port 3001
cd auth && npm start        # Port 3002
cd platform && npm start    # Port 3000
```

### Production Build

**Option 1: Using environment variables**
```bash
# Windows (PowerShell)
$env:COMPONENTS_URL="https://components.yourdomain.com"; `
$env:AUTH_URL="https://auth.yourdomain.com"; `
$env:PLATFORM_URL="https://platform.yourdomain.com"; `
npm run build:prod

# Linux/Mac
COMPONENTS_URL=https://components.yourdomain.com \
AUTH_URL=https://auth.yourdomain.com \
PLATFORM_URL=https://platform.yourdomain.com \
npm run build:prod
```

**Option 2: Using .env file**
```bash
# 1. Copy .env.example to .env.production
cp .env.example .env.production

# 2. Edit with your URLs
# 3. Build
npm run build:prod
```

**Option 3: Manual build each app**
```bash
# Components
cd components
PUBLIC_PATH=https://components.yourdomain.com/ npm run build

# Auth
cd ../auth
PUBLIC_PATH=https://auth.yourdomain.com/ npm run build

# Platform (build last!)
cd ../platform
COMPONENTS_URL=https://components.yourdomain.com \
AUTH_URL=https://auth.yourdomain.com \
PUBLIC_PATH=https://platform.yourdomain.com/ \
npm run build
```

## Deployment URLs

Replace these with your actual URLs:

| Microfrontend | Example URL | What to Deploy |
|--------------|-------------|----------------|
| Components | `https://components.yourdomain.com` | `components/dist/` |
| Auth | `https://auth.yourdomain.com` | `auth/dist/` |
| Platform | `https://platform.yourdomain.com` | `platform/dist/` |

### Common Hosting Patterns

**Pattern 1: Separate Subdomains**
```
components.myapp.com → Components microfrontend
auth.myapp.com → Auth microfrontend
app.myapp.com → Platform host
```

**Pattern 2: Single Domain with Paths**
```
myapp.com/mfe/components/ → Components
myapp.com/mfe/auth/ → Auth  
myapp.com/ → Platform
```

**Pattern 3: CDN Paths**
```
cdn.myapp.com/components/v1/ → Components
cdn.myapp.com/auth/v1/ → Auth
app.myapp.com/ → Platform
```

## Test Production Build Locally

### Method 1: Using serve
```bash
# Build all
npm run build:all

# Serve each in separate terminal
npx serve -p 3001 components/dist
npx serve -p 3002 auth/dist
npx serve -p 3000 platform/dist
```

### Method 2: Using Docker
```bash
# Build all apps first
npm run build:all

# Start with Docker Compose
docker-compose -f deployment-examples/docker-compose.yml up
```

Access at: http://localhost:3000

## Critical Deployment Rules

### ⚠️ ALWAYS Deploy in This Order:
1. **First** → Deploy Components (`components/dist`)
2. **Second** → Deploy Auth (`auth/dist`)
3. **Last** → Deploy Platform (`platform/dist`)

### ⚠️ Cache Configuration
- **remoteEntry.js**: Short cache (5 min) or no-cache
- **Other JS/CSS**: Long cache (1 year) with content hash
- All remote microfrontends **MUST** have CORS enabled

### ⚠️ Environment Variables
Each environment needs different URLs:

**Development:**
```bash
# No env vars needed - defaults to localhost
```

**Staging:**
```bash
COMPONENTS_URL=https://components-staging.myapp.com
AUTH_URL=https://auth-staging.myapp.com
PLATFORM_URL=https://platform-staging.myapp.com
```

**Production:**
```bash
COMPONENTS_URL=https://components.myapp.com
AUTH_URL=https://auth.myapp.com
PLATFORM_URL=https://platform.myapp.com
```

## Troubleshooting

### Error: "Loading script failed"
**Cause:** Platform can't reach remote microfrontend
**Check:**
1. Is the remote URL correct?
2. Is the remote actually deployed at that URL?
3. Does `/remoteEntry.js` exist at the URL?
4. Are CORS headers enabled on the remote?

```bash
# Test remoteEntry.js accessibility
curl https://components.yourdomain.com/remoteEntry.js
```

### Error: "Shared module version mismatch"
**Cause:** Different React versions in webpack configs
**Fix:** Ensure all apps use same version in `shared` config

### Build works locally but fails in production
**Cause:** PUBLIC_PATH not set correctly
**Fix:** Verify PUBLIC_PATH matches actual deployment URL with trailing slash

```bash
# Must have trailing slash!
PUBLIC_PATH=https://components.myapp.com/
```

## CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
- name: Build Components
  run: |
    cd components
    PUBLIC_PATH=${{ secrets.COMPONENTS_URL }}/ npm run build
    
- name: Deploy to S3
  run: aws s3 sync components/dist s3://bucket/ --delete
```

### Environment Secrets
Add these to your CI/CD:
- `COMPONENTS_URL`
- `AUTH_URL`
- `PLATFORM_URL`
- Deployment credentials (AWS, Azure, etc.)

## Next Steps

1. ✅ Test local production build with `serve`
2. ✅ Set up your hosting infrastructure
3. ✅ Configure environment variables
4. ✅ Run production build with your URLs
5. ✅ Deploy in correct order (remotes first, host last)
6. ✅ Test in production environment
7. ✅ Set up CI/CD pipeline (optional)

## Need Help?

- 📖 Full guide: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🔧 Nginx setup: See `deployment-examples/nginx-*.conf`
- 🐳 Docker setup: See `deployment-examples/docker-compose.yml`
- 🌐 CORS issues: Check your server CORS headers
- 📦 Module Federation docs: https://webpack.js.org/concepts/module-federation/
