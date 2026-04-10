# Developers Escape (Devvscape) 

[![Angular](https://img.shields.io/badge/Angular-18.0.6-red.svg)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-8.6.1-blue.svg)](https://ionicframework.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](https://prettier.io/)

A mobile-first application providing code-related humor and entertainment for developers. Built with modern web technologies and following best practices in mobile development.

## Download

[![Get it on Google Play](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png)](https://play.google.com/store/apps/details?id=com.silkwebhq.devvscapecode)

## Features

- **Code Humor**: Curated collection of programming jokes and memes
- **Mobile-First**: Responsive design optimized for mobile devices
-  **Push Notifications**: Stay updated with new content
- **In-App Browser**: Seamless web browsing experience
- **AdMob Integration**: Monetization through Google AdMob
- **Offline Support**: Service workers for offline functionality
- **Multi-Language**: Internationalization support
- **PWA Ready**: Progressive Web App capabilities
- **Authentication**: Secure user authentication with Firebase
- **Analytics**: Built-in analytics and tracking
- **Modern UI**: Clean, intuitive user interface

## Technology Stack

### Frontend
- **Angular 18** - Progressive web application framework
- **Ionic Framework** - Mobile-first UI components
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming library
- **NgRx** - State management with Redux pattern

### Backend & Services
- **Firebase** - Backend-as-a-Service
  - Firestore - NoSQL database
  - Authentication - User management
  - Storage - File storage
  - Analytics - User analytics
  - Messaging - Push notifications

### Mobile & Native
- **Capacitor** - Native functionality bridge
- **Android** - Native Android support
- **PWA** - Progressive Web App

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jasmine/Karma** - Testing framework
- **Transloco** - Internationalization

## Platform Support

- **Web Application** - Modern browsers
- **Android Mobile App** - Google Play Store
- **Progressive Web App** - Installable web app

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Android Studio** (for Android development)
- **Firebase Account**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/{your-username}/devvscape-code-humor.git
   cd devvscape-code-humor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create `src/environments/environment.ts` & `src/environment/environment.development.ts`:
   ```typescript
   export const environment = {
     production: false,
      firebaseConfig: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: '',
     },
   };
   ```

4. **Run development server**
   ```bash
   npm start
   # or
   ionic serve
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Android Development

```bash
# Build the app
ionic capacitor build

# Sync web code to native project
npx cap sync

# Open in Android Studio
npx cap open android
```

## Project Structure

```
devvscape-code-humor/
├── src/                          # Source files
│   ├── app/                      # Application code
│   │   ├── core/                 # Core modules
│   │   │   ├── services/         # Application services
│   │   │   ├── store/            # NgRx state management
│   │   │   ├── guards/           # Route guards
│   │   │   └── models/           # Data models
│   │   ├── components/           # Reusable components
│   │   ├── tabs/                 # Tab-based navigation
│   │   └── shared/               # Shared modules
│   ├── assets/                   # Static assets
│   ├── environments/             # Environment configurations
│   └── theme/                    # Global styles
├── android/                      # Android native project
├── www/                          # Web build output
├── resources/                    # App resources (icons, splash)
├── public/                       # Public assets
└── docs/                         # Documentation
```

##  Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run e2e
```

## 📦 Build & Deploy

### Web Build
```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### Android Build
```bash
# Build for Android
ionic capacitor build android

# Build APK
ionic capacitor build android --prod
```

## Contributing

We love your input! We want to make contributing to Devvscape as easy and transparent as possible, whether it's:

-  Reporting a bug
-  Discussing the current state of the code
-  Submitting a fix
-  Proposing new features
-  Becoming a maintainer

See our [Contributing Guide](CONTRIBUTING.md) for details.

## Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/{your-username}/devvscape-code-humor/issues/new).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **Ionic Team** - For the amazing mobile framework
- **Angular Team** - For the robust web framework
- **Firebase Team** - For the powerful backend services
- **Our Contributors** - For making this project better

## Support

- **Email**: support@devvscape.com
- **Twitter**: [@b4r0id](https://x.com/b4r0id)
- **Discord**: [Join our community](https://discord.gg/vpS3Uu88)
- **Documentation**: [docs.devvscape.com](https://docs.devvscape.com)

## Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/silkwebhq/devvscape-code-humor)
![GitHub issues](https://img.shields.io/github/issues/silkwebhq/devvscape-code-humor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/silkwebhq/devvscape-code-humor)
![GitHub stars](https://img.shields.io/github/stars/silkwebhq/devvscape-code-humor)

---

**Made with ❤️ by the Devvscape Team**

*This project is actively maintained. For any issues or feature requests, please open an issue in the repository.*
