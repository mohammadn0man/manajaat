# Munajaat Nomani 🤲

A beautiful React Native mobile application for daily Islamic supplications (duas) organized by days of the week. Built with Expo and TypeScript, featuring a clean and intuitive interface for spiritual reflection and prayer.

## 📱 Features

### Core Features
- **Daily Duas**: Browse Islamic supplications organized by days of the week
- **Daily Progress Tracking**: Track your daily dua reading progress with completion status.
- **Session Management**: Complete daily dua sessions with progress indicators
- **Multilingual Support**: Support for English, Arabic, and Urdu with RTL text support
- **Favorites System**: Save your favorite duas for quick access
- **Sharing & Copying**: Share duas via social media or copy to clipboard
- **Beautiful UI**: Modern, clean interface with thoughtful design
- **Easy Navigation**: Intuitive day-by-day browsing with bottom tab navigation

### Customization
- **Theme Support**: Light, Dark, and System theme options
- **Font Size Control**: Small, Normal, and Large font size options
- **Language Selection**: Switch between English, Urdu, and Arabic
- **RTL Support**: Proper right-to-left text rendering for Arabic and Urdu

### User Experience
- **Responsive Design**: Optimized for both iOS and Android devices
- **Accessibility**: Built with comprehensive accessibility features
- **Persistent Storage**: Settings, favorites, and progress saved locally using AsyncStorage
- **Smooth Navigation**: Stack and tab-based navigation with React Navigation v6
- **Session Completion**: Modal dialogs and completion states for daily sessions
- **Typography System**: Custom typography component for consistent text rendering

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (Stack & Bottom Tabs)
- **Styling**: NativeWind (Tailwind CSS for React Native) + StyleSheet
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage for persistent data
- **State Management**: React Context API
- **Internationalization**: RTL support for Arabic/Urdu
- **Development**: ESLint, Prettier for code quality

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Key Dependencies
- `@react-navigation/native` & `@react-navigation/stack` & `@react-navigation/bottom-tabs` - Navigation
- `@react-native-async-storage/async-storage` - Local data persistence
- `expo-clipboard` - Copy functionality for duas
- `react-native` Share API - Native sharing capabilities
- `nativewind` - Tailwind CSS for React Native
- `@expo/vector-icons` - Icon library

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/munajaat.git
cd munajaat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm start
```

### 4. Run on your preferred platform
```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code analysis
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
munajaat/
├── assets/
│   ├── data/
│   │   └── duas.json          # Islamic supplications data
│   ├── fonts/                 # Custom fonts
│   └── images/                # App icons and images
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── CompletionState.tsx    # Session completion UI
│   │   ├── DayPill.tsx           # Day selection component
│   │   ├── DuaCard.tsx           # Individual dua display
│   │   ├── DuaPager.tsx          # Swipeable dua navigation
│   │   ├── IconButton.tsx        # Custom icon button
│   │   ├── SessionCompleteModal.tsx # Session completion modal
│   │   ├── TopBar.tsx            # Navigation header
│   │   ├── Typography.tsx        # Custom typography system
│   │   └── index.ts              # Component exports
│   ├── contexts/             # React contexts
│   │   ├── AppContext.tsx    # Global app state management
│   │   └── ThemeProvider.tsx # Theme management context
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization
│   │   └── ur.json           # Urdu translations
│   ├── navigation/           # Navigation configuration
│   │   ├── AppNavigator.tsx  # Main navigation setup
│   │   └── types.ts          # Navigation type definitions
│   ├── screens/              # App screens
│   │   ├── DaysListScreen.tsx    # List of all days
│   │   ├── DayViewScreen.tsx     # Duas for specific day
│   │   ├── DuaDetailScreen.tsx   # Detailed dua view
│   │   ├── FavoritesScreen.tsx   # User's favorite duas
│   │   ├── HomeScreen.tsx        # Main screen
│   │   └── SettingsScreen.tsx    # App settings and preferences
│   ├── services/             # Business logic and data services
│   │   ├── dataLoader.ts     # Data loading utilities
│   │   ├── duaService.ts     # Dua-related operations
│   │   ├── storageService.ts # AsyncStorage operations
│   │   └── index.ts          # Service exports
│   ├── styles/               # Global styles
│   │   └── global.css        # Global CSS styles
│   └── types/                # TypeScript type definitions
│       ├── dua.ts            # Dua-related types
│       └── index.ts          # Type exports
├── app.json                  # Expo configuration
├── App.tsx                   # Main app component
├── package.json              # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## 🗓️ Data Structure

The app organizes duas by days of the week. Each dua contains:

- **Arabic text**: Original Arabic supplication
- **Translation**: Urdu translation
- **Reference**: Source or category of the dua

```typescript
interface Dua {
  id: string;
  day: DayOfWeek;
  arabic: string;
  translations: {
    en?: string;
    ur?: string;
  };
  reference?: string;
}

// Storage service manages daily progress
interface StorageService {
  // Progress tracking methods
  getTodayProgress(): Promise<number>;
  setTodayProgress(progress: number): Promise<void>;
  isTodayCompleted(): Promise<boolean>;
  setTodayCompleted(): Promise<void>;
  resetTodayProgress(): Promise<void>;
}
```

## 🎨 Styling & Theming

This project uses a hybrid approach for styling:

- **NativeWind**: Tailwind CSS utilities for rapid development
- **StyleSheet**: React Native's built-in styling for platform-specific designs
- **Theme System**: Dynamic theme switching (Light/Dark/System)
- **RTL Support**: Proper right-to-left layout for Arabic and Urdu
- **Font Scaling**: Adjustable font sizes for better accessibility
- **Consistent Design**: Unified color palette and spacing system

## 📱 Platform Support

- **iOS**: Full support with native look and feel
- **Android**: Optimized for Android devices with Material Design elements
- **Web**: Progressive web app capabilities

## 🔧 Configuration Files

- `app.json` - Expo app configuration and metadata
- `babel.config.js` - Babel transpiler configuration
- `metro.config.js` - Metro bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration for NativeWind
- `tsconfig.json` - TypeScript compiler configuration
- `nativewind-env.d.ts` - NativeWind TypeScript declarations

## 🏗️ Architecture

### State Management
The app uses React Context API for global state management:
- **AppContext**: Manages language, theme, font size, and favorites
- **ThemeProvider**: Dedicated theme management with dynamic styling
- **Persistent Storage**: Uses AsyncStorage to save user preferences and progress
- **RTL Support**: Automatic layout direction based on selected language
- **Progress Tracking**: Daily session progress and completion status

### Navigation Structure
```
MainTabs (Bottom Tab Navigator)
├── Home Tab
├── Days Tab  
├── Favorites Tab
└── Settings Tab

Stack Navigator
├── DayView Screen (from Home/Days)
└── DuaDetail Screen (from any screen)
```

### Data Flow
1. **Data Loading**: JSON file loaded and parsed on app start
2. **Service Layer**: Business logic separated from UI components
3. **Context Provider**: Global state accessible throughout the app
4. **Local Storage**: User preferences, favorites, and daily progress persisted locally
5. **Progress Tracking**: Daily completion status with date-based storage keys
6. **Session Management**: Modal-based completion flow with restart capabilities

## 📱 App Screens

### Main Screens
1. **Home Screen**: Daily duas with progress tracking and session management
2. **Days List Screen**: Browse duas organized by weekdays
3. **Favorites Screen**: View and manage saved favorite duas
4. **Settings Screen**: Customize language, theme, font size, and app preferences

### Detail Screens  
1. **Day View Screen**: Display all duas for a specific day
2. **Dua Detail Screen**: Full dua view with Arabic text, translation, and reference

### Key Features by Screen
- **Daily Progress**: Track reading progress with visual indicators and completion states
- **Session Management**: Complete daily sessions with congratulatory modals
- **Sharing & Copying**: Copy duas to clipboard or share via native sharing
- **Favorites Management**: Add/remove duas from favorites with heart icon
- **Swipeable Navigation**: DuaPager component for smooth dua browsing
- **Language Switching**: Seamless transition between English, Urdu, and Arabic
- **Theme Toggle**: Instant theme switching with system theme detection
- **Font Scaling**: Real-time font size adjustment for better readability
- **RTL Layout**: Automatic layout flip for Arabic and Urdu content
- **Typography System**: Consistent text rendering with custom Typography component

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Islamic supplications sourced from authentic Islamic texts
- Thanks to the React Native and Expo communities
- Special thanks to contributors and testers

## 📞 Support

If you have any questions or need support, please:

1. Check the [Issues](https://github.com/your-username/munajaat/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainers

---

**May Allah accept our prayers and supplications. Ameen.** 🤲

*Built with ❤️ for the Muslim community*