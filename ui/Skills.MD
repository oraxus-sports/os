# UI Development Skills & Best Practices

**Sports Management Application - Web & Mobile**

## Project Structure
```
os/ui/
├── mobile/          # React Native mobile application
├── web/             # React web application  
└── lib/             # Shared common libraries (Tailwind components, utilities, i18n, etc.)
```

### Build Strategy
- `lib/` is a shared dependency imported by both `mobile/` and `web/`
- No duplicate library entries - single source of truth in `lib/`
- Both platforms consume components, themes, and utilities from `lib/`

---

## Best Practices Ordered by Priority

### 1. **Architecture & Code Organization**
- **Module Federation / Monorepo**: Use Nx, Turborepo, or Lerna for managing multi-platform codebase
- **Shared Component Library**: All reusable components, themes, and utilities in `lib/`
- **Platform-Specific Code**: Keep `mobile/` and `web/` lean with only platform-specific implementations
- **Atomic Design Pattern**: Organize components as atoms → molecules → organisms → templates → pages
- **Feature-Based Structure**: Group by feature rather than file type

### 2. **Component Development with Tailwind CSS**
- **Design System Foundation**: Define design tokens (colors, spacing, typography) in `lib/tailwind.config.js`
- **Shared Tailwind Config**: Extend from `lib/` in both web and mobile configs
- **Component Library**: DaisyUI, Flowbite, or Shadcn/UI for pre-built accessible components
- **Responsive Design**: Mobile-first approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- **Dark Mode Support**: Use Tailwind's dark mode with system preference detection
- **CSS-in-JS Alternative**: Use `tailwind-merge` and `clsx` for conditional classes
- **NativeWind**: For React Native mobile app to use Tailwind CSS syntax

### 3. **Internationalization (i18n)**
- **Libraries**: 
  - Web: `react-i18next` or `next-intl`
  - Mobile: `react-i18next` (works with React Native)
- **Supported Languages**: English (default), Tamil, Telugu, Hindi
- **Structure**:
  ```
  lib/i18n/
  ├── locales/
  │   ├── en/
  │   │   ├── common.json
  │   │   ├── sports.json
  │   │   └── auth.json
  │   ├── ta/
  │   │   └── common.json
  │   ├── te/
  │   │   └── common.json
  │   └── hi/
  │       └── common.json
  └── config.js
  ```
- **Namespace Organization**: Separate by feature domain (common, auth, sports, teams, etc.)
- **Auto-Translation**: Use Google Cloud Translation API or DeepL for initial translations
- **RTL Support**: Plan for future right-to-left language support
- **Date/Time Formatting**: Use `date-fns` or `dayjs` with locale support
- **Number/Currency Formatting**: Use `Intl.NumberFormat` for locale-specific formatting
- **Language Detection**: Auto-detect from browser/device settings with manual override

### 4. **Accessibility (a11y)**
- **WCAG 2.1 Level AA Compliance**: Target minimum standard
- **Keyboard Navigation**: 
  - All interactive elements accessible via Tab, Enter, Space, Arrow keys
  - Visible focus indicators
  - Skip navigation links
  - Keyboard shortcuts for common actions
- **Screen Reader Support**:
  - Semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`)
  - ARIA labels, roles, and properties where needed
  - Alt text for images
  - Live regions for dynamic content
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Management**: Trap focus in modals, manage focus on route changes
- **Testing Tools**:
  - `@axe-core/react` for automated testing
  - `eslint-plugin-jsx-a11y` for linting
  - Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- **Mobile Accessibility**:
  - Touch target size: minimum 44x44px
  - Accessible names for React Native components
  - VoiceOver (iOS) and TalkBack (Android) testing

### 5. **Unit Testing**
- **Test Framework**: Jest + React Testing Library
- **Mobile Testing**: Jest + React Native Testing Library
- **Coverage Target**: 80%+ for critical paths
- **Test Types**:
  - Component rendering tests
  - User interaction tests (clicks, form inputs)
  - Accessibility tests (axe integration)
  - i18n text rendering tests
  - Custom hook tests
- **Mocking**: Mock external APIs, navigation, and platform-specific modules
- **Snapshot Testing**: For stable UI components (use sparingly)
- **Integration Tests**: Test component interactions with Cypress or Playwright (web)
- **E2E Testing**: 
  - Web: Cypress, Playwright
  - Mobile: Detox, Appium

### 6. **SEO & Meta Tags (Web Only)**
- **Essential Meta Tags**:
  ```html
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Sports management app description" />
  <meta name="keywords" content="sports, management, cricket, soccer" />
  <meta name="author" content="Your Team" />
  <meta name="robots" content="index, follow" />
  ```
- **Open Graph (Social Media)**:
  ```html
  <meta property="og:title" content="Sports Management App" />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="/og-image.jpg" />
  <meta property="og:url" content="https://yourapp.com" />
  <meta property="og:type" content="website" />
  ```
- **Twitter Cards**:
  ```html
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="..." />
  <meta name="twitter:description" content="..." />
  <meta name="twitter:image" content="/twitter-image.jpg" />
  ```
- **Favicon & App Icons**: Multiple sizes and formats
- **Structured Data**: JSON-LD schema for sports events/organizations
- **Canonical URLs**: Prevent duplicate content issues
- **Language Alternates**: `<link rel="alternate" hreflang="ta" href="..." />`

### 7. **Performance Optimization**
- **Code Splitting**: Lazy load routes and heavy components
- **Tree Shaking**: Remove unused code during build
- **Image Optimization**:
  - Web: Next.js Image component or `react-lazy-load-image-component`
  - Mobile: React Native Fast Image
  - Use WebP format with fallbacks
- **Bundle Size**: Analyze with `webpack-bundle-analyzer` or `vite-plugin-bundle-analyzer`
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` appropriately
- **Virtual Lists**: For long lists, use `react-window` or `react-virtualized`
- **PWA**: Service workers for offline support (web)
- **Mobile Performance**:
  - FlatList optimization (React Native)
  - Minimize bridge communication
  - Use Hermes engine (React Native)

### 8. **State Management**
- **Local State**: `useState`, `useReducer` for component-level state
- **Global State**: Redux Toolkit with Redux Persist
  - Actions and reducers for state mutations
  - Redux Thunk or Redux Saga for async operations
  - Redux DevTools for debugging
- **Server State**: React Query or SWR for API data caching
- **Form State**: React Hook Form or Formik with Yup validation
- **Persistent State**: Redux Persist with AsyncStorage (mobile), localStorage (web)

### 9. **Type Safety**
- **TypeScript**: Enforce strong typing across all codebases
- **Shared Types**: Define common types in `lib/types/`
- **Zod or Yup**: Runtime validation for API responses
- **Strict Mode**: Enable strict TypeScript compiler options
- **Type Generation**: Auto-generate types from API schema (OpenAPI/GraphQL)

### 10. **Code Quality & Standards**
- **Linting**: ESLint with React, TypeScript, a11y plugins
- **Formatting**: Prettier with consistent config
- **Pre-commit Hooks**: Husky + lint-staged for automated checks
- **Naming Conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Hooks: camelCase with `use` prefix (`useAuth.js`)
  - Utilities: camelCase (`formatDate.js`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Documentation**: JSDoc comments for public APIs
- **Code Reviews**: Mandatory peer reviews before merge

### 11. **Version Control & Branching**
- **Git Flow**: `main` (prod), `develop`, `feature/*`, `hotfix/*`
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Pull Request Templates**: Standardize PR descriptions
- **Branch Protection**: Require reviews and passing CI/CD

### 12. **CI/CD Pipeline**
- **Automated Build**: Build both web and mobile on each commit
- **Test Automation**: Run unit, integration, e2e tests
- **Lint & Format Checks**: Fail build on linting errors
- **Deploy Previews**: Deploy PR previews for web (Vercel, Netlify)
- **Mobile Distribution**: TestFlight (iOS), Google Play Internal Testing (Android)
- **Environment Variables**: Separate configs for dev, staging, production

### 13. **Error Handling & Logging**
- **Error Boundaries**: Catch React errors gracefully
- **API Error Handling**: Consistent error response handling
- **User-Friendly Messages**: Show translated error messages
- **Logging**: 
  - Sentry or LogRocket for production error tracking
  - Console logs removed in production builds
- **Network Error Handling**: Offline detection and retry logic

### 14. **Security**
- **Authentication**: JWT tokens with secure storage
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Sanitize all user inputs
- **HTTPS Only**: Enforce secure connections
- **Content Security Policy (CSP)**: Prevent XSS attacks
- **Dependency Scanning**: Regular updates and vulnerability checks (Dependabot)
- **Environment Variables**: Never commit secrets to git

### 15. **Analytics & Monitoring**
- **User Analytics**: Google Analytics, Mixpanel, or Amplitude
- **Performance Monitoring**: Web Vitals (web), React Native Performance (mobile)
- **A/B Testing**: Feature flags for gradual rollouts
- **User Feedback**: In-app feedback mechanisms

### 16. **Design & UX**
- **Design Tokens**: Centralize colors, spacing, typography in `lib/`
- **Consistent Spacing**: Use Tailwind's spacing scale (4px base)
- **Typography Scale**: Consistent font sizes and line heights
- **Loading States**: Skeletons, spinners for async operations
- **Empty States**: Meaningful messages when no data
- **Error States**: Clear error messages with recovery actions
- **Mobile Gestures**: Swipe, pull-to-refresh (mobile)
- **Animations**: Smooth transitions using Framer Motion or React Native Reanimated

### 17. **Development Tools**
- **Hot Reload**: Fast refresh for rapid development
- **DevTools**: React DevTools, Redux DevTools
- **Storybook**: Component library documentation and testing
- **Mock APIs**: MSW (Mock Service Worker) for local development
- **Mobile Debugging**: Flipper, React Native Debugger

---

## Technology Stack Summary

### Web (`web/`)
- **Framework**: React 18+ or Next.js 14+
- **Styling**: Tailwind CSS + DaisyUI/Flowbite
- **Routing**: React Router v6 or Next.js App Router
- **Build Tool**: Vite or Webpack 5
- **Testing**: Jest + React Testing Library + Playwright

### Mobile (`mobile/`)
- **Framework**: React Native 0.73+
- **Styling**: NativeWind (Tailwind for React Native)
- **Navigation**: React Navigation 6
- **Build Tool**: Metro bundler
- **Testing**: Jest + React Native Testing Library + Detox

### Shared Library (`lib/`)
- **Components**: Headless UI components
- **Utilities**: date-fns, lodash-es
- **i18n**: react-i18next
- **State**: Redux Toolkit + Redux Persist
- **Forms**: React Hook Form + Zod
- **API Client**: axios with interceptors
- **Type Safety**: TypeScript 5+

---

## Code Generation Prompts

### Component Generation (Both Web & Mobile)
```
Create a [ComponentName] component in lib/components with:
- TypeScript interface for props
- Tailwind CSS styling
- i18n support for labels (english, tamil, telugu, hindi)
- Accessibility (keyboard nav, ARIA labels)
- Unit tests with React Testing Library
- Responsive design (mobile-first)
- Dark mode support
- Loading and error states
```

### Feature Module Generation
```
Generate a [FeatureName] module with:
- Folder structure: components/, hooks/, services/, types/, i18n/
- i18n locale files (en, ta, te, hi) in lib/i18n/locales/[lang]/[feature].json
- TypeScript types in lib/types/[feature].ts
- Custom hooks with unit tests
- API service layer with error handling
- Accessibility compliant components
- Both web and mobile versions if platform-specific
```

### Form Generation
```
Create a [FormName] form with:
- React Hook Form + Zod schema validation
- All labels in i18n files (en, ta, te, hi translations)
- Form fields: [list fields]
- Error messages (translated)
- Keyboard navigation
- ARIA labels for screen readers
- Loading state during submission
- Success/error feedback
- Unit tests for validation logic
```

### Page/Screen Generation
```
Generate a [PageName] page/screen with:
- Layout structure (header, content, footer)
- SEO meta tags (web only - title, description, OG tags)
- i18n page title and content
- Accessibility (h1, semantic HTML, focus management)
- Loading skeleton
- Error boundary
- Responsive layout
- Unit and integration tests
```

---

## Checklist for Every Component/Feature

- [ ] TypeScript types defined
- [ ] Tailwind CSS styling applied
- [ ] All text in i18n files (en, ta, te, hi)
- [ ] Keyboard navigation tested
- [ ] ARIA labels added for screen readers
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode compatible
- [ ] Unit tests written (80%+ coverage)
- [ ] Loading and error states handled
- [ ] Accessibility tested with axe
- [ ] Code linted and formatted
- [ ] Performance optimized (memoization if needed)
- [ ] Works on both web and mobile (or platform-specific version)

---

## Next Steps

1. Set up monorepo structure with Nx or Turborepo
2. Configure shared Tailwind config in `lib/`
3. Set up i18n infrastructure with react-i18next
4. Install and configure DaisyUI or Flowbite
5. Set up NativeWind for React Native
6. Create base accessibility testing setup
7. Configure Jest and testing libraries
8. Set up CI/CD pipeline for automated testing and deployment
