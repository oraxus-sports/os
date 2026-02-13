# Microfrontend Authentication Setup

## Overview
This project now uses a dedicated **auth microfrontend** for authentication with Module Federation.

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

## Development Notes

- Auth runs independently on port 3002
- Platform imports auth components via Module Federation
- Shared dependencies (React, React-DOM, React-Router) are singletons
- Tailwind CSS configured with Summer Sunset colors
- AuthContext provides global auth state to all consuming apps
