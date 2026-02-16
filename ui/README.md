# Sports Management UI

Multi-platform sports management application with shared component library.

## Project Structure

```
os/ui/
├── lib/              # Shared component library
├── web/              # React web application
├── mobile/           # React Native mobile application
└── Skills.MD         # Development best practices guide
```

## Features

- ✅ **Multi-language Support**: English, Tamil, Telugu, Hindi
- ✅ **Responsive Design**: Mobile-first Tailwind CSS
- ✅ **Accessibility**: WCAG 2.1 Level AA compliant
- ✅ **Type Safety**: Full TypeScript support
- ✅ **State Management**: Redux Toolkit with Redux Persist
- ✅ **Form Validation**: React Hook Form + Zod
- ✅ **API Client**: Axios with interceptors
- ✅ **Icons**: Lucide React icons
- ✅ **Testing**: Jest + React Testing Library

## Sign Up Page

The sign-up page includes:
- Name, Email, and Mobile Number fields
- Toggle between Email/Phone sign-in methods
- Multi-language support (en, ta, te, hi)
- Sports equipment background image
- Fully accessible with keyboard navigation
- Dark mode support
- Form validation with error messages

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile): `npm install -g expo-cli`

### Install Dependencies

```bash
# Install shared library dependencies
cd lib
npm install

# Install web dependencies
cd ../web
npm install

# Install mobile dependencies (React Native)
cd ../mobile
npm install
```

**Important:** Both web and mobile use **react-i18next v13.5.0** for compatibility with i18next v23.7.0. Do not upgrade react-i18next to v16.x as it will cause module import errors.

### Running the Applications

#### Web Application
```bash
cd web
npm run dev
```
Opens at http://localhost:3000

#### Mobile Application
```bash
cd mobile
npm start
```
Then press:
- `a` for Android
- `i` for iOS
- `w` for web preview

## Background Image Setup

1. Save the sports equipment image as:
   - Web: `web/src/assets/sports-background.png`
   - Mobile: `mobile/assets/sports-background.png`

2. The image is automatically used as the background for the sign-up page

## Changing Language

The language selector is available in the top-right corner:
- 🌐 English
- 🌐 தமிழ் (Tamil)
- 🌐 తెలుగు (Telugu)
- 🌐 हिन्दी (Hindi)

## Development

### Adding New Components

1. Create component in `lib/components/`
2. Add translations in `lib/i18n/locales/{lang}/`
3. Export from component library
4. Use in web or mobile apps

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Tech Stack

### Shared Library (`lib/`)
- React 18
- TypeScript 5
- Tailwind CSS
- react-i18next (i18n)
- Redux Toolkit + Redux Persist
- React Hook Form + Zod
- Axios
- Lucide React (icons)

### Web (`web/`)
- Vite
- React Router
- All lib dependencies

### Mobile (`mobile/`)
- React Native
- Expo
- NativeWind (Tailwind for RN)
- All lib dependencies

## Accessibility Features

- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ✅ ARIA labels and roles
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Color contrast compliance
- ✅ Touch target sizes (44×44px minimum)
- ✅ Error announcements

## License

MIT
