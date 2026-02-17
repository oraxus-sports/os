# Microfrontend Authentication Setup

## Overview
This project uses **Module Federation** for microfrontend architecture with dedicated auth module.

**Deployment Strategy**:
- 🔧 **Development**: Each microfrontend runs independently (`npm start`)
- ☁️ **Production**: All deploy together to AWS infrastructure

## 🚀 Quick Links

- 📖 [Development Setup](#setup-instructions) - Run locally
- ☁️ **[AWS Deployment](AWS-QUICKSTART.md)** - **Deploy to AWS (Recommended)**
- 🏗️ [Production Build Guide](PRODUCTION-BUILD.md) - Build for production
- 🔄 [CI/CD Setup](CI-CD-README.md) - Automated deployments
- 🌐 [Complete Deployment Guide](DEPLOYMENT.md) - All deployment options

## Structure

```
ui-plugins/
├── auth/                    # Authentication microfrontend (Port 3002)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx    # Login page with username/mobile/social options
│   │   │   └── SignUp.jsx   # Sign up page with email/password/social
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Shared authentication state
│   │   ├── hooks/
│   │   │   └── useAuth.js   # Authentication hook
│   │   ├── services/
│   │   │   └── authService.js  # API calls for auth
│   │   └── App.jsx
│   ├── package.json
│   └── webpack.config.js    # Exposes Login, SignUp, AuthProvider
│
├── components/              # Shared UI components (Port 3001)
│   └── src/components/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Login.jsx        # Old - can be removed
│
└── platform/                # Host application (Port 3000)
    ├── src/
    │   └── App.jsx          # Imports auth components via Module Federation
    ├── package.json
    └── webpack.config.js    # Consumes authApp remote

```

## Setup Instructions

### 1. Install Dependencies

```bash
# Auth microfrontend
cd ui-plugins/auth
npm install

# Platform (add react-router-dom if needed)
cd ../platform
npm install
```

### 2. Start Applications

You need to run all three microfrontends:

```bash
# Terminal 1 - Components microfrontend
cd ui-plugins/components
npm start  # Runs on port 3001

# Terminal 2 - Auth microfrontend
cd ui-plugins/auth
npm start  # Runs on port 3002

# Terminal 3 - Platform host
cd ui-plugins/platform
npm start  # Runs on port 3000
```

### 3. Access the Application

- **Platform**: http://localhost:3000
- **Auth Standalone**: http://localhost:3002
- **Components Standalone**: http://localhost:3001

## Routes

- `/` → Redirects to `/login`
- `/login` → Login page (username, mobile OTP, or social)
- `/signup` → Sign up page (email/password or social)
- `/dashboard` → Protected dashboard (after login)

## Features

### Login Page
- **Username/Email login** with password
- **Mobile OTP login** (send OTP → verify)
- **Social login** (Google, Facebook, Apple)

### Sign Up Page
- **Email/Password registration** with validation
- **Password confirmation** matching
- **Social sign up** (Google, Facebook, Apple)

### Authentication Features
- **Shared auth state** via AuthContext
- **Token management** with localStorage
- **useAuth hook** for accessing auth state
- **Navigation** after successful auth
- **Error handling** with user feedback

## Color Palette (Summer Sunset)

```css
--atomic-tangerine: #ff6b35
--peach-glow: #f7c59f
--beige: #efefd0
--dusk-blue: #004e89
--baltic-blue: #1a659e
```

## Module Federation Configuration

### Auth App (Exposes)
```javascript
exposes: {
  './Login': './src/components/Login',
  './SignUp': './src/components/SignUp',
  './AuthProvider': './src/context/AuthContext',
  './useAuth': './src/hooks/useAuth',
}
```

### Platform (Consumes)
```javascript
remotes: {
  authApp: 'authApp@http://localhost:3002/remoteEntry.js',
}
```

## Next Steps

1. **API Integration**: Replace mock auth in `AuthContext.jsx` with real API calls
2. **Protected Routes**: Add route guards for authenticated pages
3. **Password Reset**: Add forgot password functionality
4. **Email Verification**: Add email verification flow
5. **Social OAuth**: Integrate real OAuth providers
6. **Token Refresh**: Implement token refresh logic
7. **Remove Old Components**: Delete old Login from components folder

## Production Deployment

### AWS Deployment (Recommended for Your Setup) ☁️

**Your apps run separately in development, but deploy together to AWS in production.**

#### Quick Deploy

```bash
# One-time setup (creates AWS infrastructure)
# See: AWS-QUICKSTART.md

# Deploy to production
npm run deploy:aws

# Or deploy to staging
npm run deploy:aws:staging
```

**Complete Guide**: [AWS-QUICKSTART.md](AWS-QUICKSTART.md) or [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md)

#### AWS Architecture

**Development**: Each app runs independently
- Components: `http://localhost:3001`
- Auth: `http://localhost:3002`
- Platform: `http://localhost:3000`

**Production**: All apps deployed to same AWS infrastructure
- Components: `https://app.yourdomain.com/components/`
- Auth: `https://app.yourdomain.com/auth/`
- Platform: `https://app.yourdomain.com/`

---

### Alternative: Netlify/Vercel (Quick Testing)

For quick testing or if you don't want to set up AWS:

```bash
npm install -g netlify-cli
netlify login
cd components && netlify deploy --prod
cd ../auth && netlify deploy --prod
cd ../platform && netlify deploy --prod
```

**Guide**: [NETLIFY-VERCEL-DEPLOYMENT.md](NETLIFY-VERCEL-DEPLOYMENT.md)

---

### Available Scripts

```bash
# Development
npm run start:all       # Start all microfrontends locally

# Production (AWS)
npm run deploy:aws      # Build & deploy to AWS production
npm run deploy:aws:staging  # Build & deploy to AWS staging

# Manual build
npm run build:all       # Build all for production
npm run build:prod      # Build with environment URLs

# Utilities
npm run install:all     # Install all dependencies
npm run clean           # Clean all dist folders
```

### Documentation

| Guide | Description |
|-------|-------------|
| **[AWS-QUICKSTART.md](AWS-QUICKSTART.md)** | **Quick start for AWS deployment** |
| [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) | AWS deployment overview |
| [aws-infrastructure/setup-guide.md](aws-infrastructure/setup-guide.md) | Detailed AWS setup |
| [CI-CD-README.md](CI-CD-README.md) | Automated CI/CD options |
| [DEPLOYMENT.md](DEPLOYMENT.md) | All deployment options |

## Development Notes

- Auth runs independently on port 3002
- Platform imports auth components via Module Federation
- Shared dependencies (React, React-DOM, React-Router) are singletons
- Tailwind CSS configured with Summer Sunset colors
- AuthContext provides global auth state to all consuming apps
- Environment-based configuration supports dev/staging/production
