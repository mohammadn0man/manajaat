# Manajaat Nomani (مِناجه نعمائى)

A React Native app built with Expo for Islamic supplications and duas.

## Features

- Daily duas organized by day of the week
- Beautiful UI with NativeWind (Tailwind CSS for React Native)
- React Navigation with stack and bottom tabs
- TypeScript support with strict mode
- ESLint and Prettier configuration

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   expo start
   ```

3. Scan the QR code with Expo Go app on your mobile device, or press `w` to open in web browser.

### Available Scripts

- `expo start` - Start the development server
- `expo start --web` - Start web development server
- `expo start --ios` - Start iOS simulator
- `expo start --android` - Start Android emulator
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
├── assets/
│   ├── data/          # JSON data files (duas.json)
│   ├── fonts/         # Custom fonts
│   └── images/        # App icons and images
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # App screens
│   ├── navigation/    # Navigation configuration
│   ├── services/      # API and data services
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── i18n/          # Internationalization
│   └── styles/        # Global styles and CSS
├── App.tsx            # Main app component
└── global.css         # NativeWind CSS imports
```

## Technologies Used

- **Expo** - React Native development platform
- **TypeScript** - Type-safe JavaScript
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Navigation library
- **ESLint & Prettier** - Code quality and formatting

## Development

The app is configured with:

- Strict TypeScript mode
- ESLint for code quality
- Prettier for code formatting
- NativeWind for styling

## License

This project is for educational and personal use.
