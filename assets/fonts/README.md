# Fonts Directory

This directory contains custom fonts for the Manajaat Nomani app.

## Adding Fonts

1. Place your font files (.ttf, .otf) in this directory
2. Update the font loading in your app using expo-font
3. Reference fonts in your NativeWind configuration if needed

## Example Usage

```typescript
import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    CustomFont: require('./assets/fonts/CustomFont.ttf'),
  });
};
```
