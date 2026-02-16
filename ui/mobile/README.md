# Mobile App Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio with SDK

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Add Sports Background Image**
   - Save your sports equipment background image as:
     - `assets/sports-background.png`
   
3. **Add App Icons (Optional)**
   - `assets/icon.png` (1024x1024)
   - `assets/splash.png` (1284x2778)
   - `assets/adaptive-icon.png` (Android, 1024x1024)
   - `assets/favicon.png` (Web, 48x48)

## Running the App

### Development Mode
```bash
npm start
```

This will open the Expo DevTools in your browser.

### Run on Specific Platform

**iOS Simulator (Mac only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

### Using Expo Go App

1. Install Expo Go on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Run `npm start` 

3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## Key Dependencies

- **react-i18next**: Multi-language support (v13.5.0)
- **i18next**: Translation framework (v23.7.0)
- **react-hook-form**: Form handling (v7.49.0)
- **zod**: Schema validation (v3.22.4)
- **axios**: HTTP client (v1.6.0)
- **@reduxjs/toolkit**: State management (v2.0.1)
- **nativewind**: Tailwind CSS for React Native (v4.0.1)
- **expo**: Development platform (~50.0.0)
- **expo-router**: File-based routing (~3.4.0)

## Version Compatibility

✅ **react-i18next v13.5.0** is used (NOT v16.x) for compatibility with i18next v23.7.0

This matches the web application setup to avoid the `keyFromSelector` import error.

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx       # Root layout
│   ├── index.tsx         # Sign-up screen
│   └── i18n.ts          # i18n configuration
├── components/
│   └── SignUpMobile.tsx  # Mobile sign-up component
├── assets/
│   └── sports-background.png  # Background image
├── app.json             # Expo configuration
├── babel.config.js      # Babel configuration
├── tailwind.config.js   # Tailwind CSS config
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config

## Features

- ✅ Multi-language support (English, Tamil, Telugu, Hindi)
- ✅ Form validation with Zod
- ✅ Touch-optimized UI (44×44px minimum targets)
- ✅ Native styling with NativeWind (Tailwind for RN)
- ✅ Accessibility (VoiceOver & TalkBack support)
- ✅ Redux state management
- ✅ Axios API integration ready

## Troubleshooting

### Clear Cache
```bash
expo start -c
```

### Reset Dependencies
```bash
rm -rf node_modules
npm install
```

### Metro Bundler Issues
```bash
npx expo start --clear
```

## Building for Production

### iOS (Mac only)
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Note: You'll need an Expo account. Sign up at https://expo.dev
