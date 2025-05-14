# Dark Light Colors

A lightweight utility library for color management with dark/light mode adaptations. This package provides tools for adapting colors between dark and light modes while maintaining their visual character, creating gradients, and ensuring WCAG accessibility compliance.

**[View the interactive demo](https://acespace-love.github.io/readable-dark-light-colors/)**

> **Note:** This library is used internally by [AceSpace](https://acespace.love) and may be subject to change at will without warning.

## Installation

```bash
npm install dark-light-colours
# or
yarn add dark-light-colours
# or
pnpm add dark-light-colours
```

## Features

- Adapt colors for dark/light modes automatically
- Create gradient strings from color arrays
- Check WCAG contrast compliance
- Get appropriate text colors for backgrounds
- Lighten or darken sets of colors easily
- Support for colors that work in both light and dark themes
- Pre-defined color themes and palettes

## Usage

```typescript
import {
  getAdaptedColor,
  adaptGradientColors,
  createGradientString,
  getTextColor,
  isWCAGCompliant,
  getContrastRatio,
  testColorsValid,
  lightenColors,
  darkenColors,
  DEFAULT_THEMES,
  type Theme
} from 'dark-light-colours';

// Adapt a color for dark mode
const adaptedColor = getAdaptedColor('#3366FF', 'dark');

// Adapt a color for both light and dark modes (compatible with both backgrounds)
const adaptedForBoth = getAdaptedColor('#3366FF', 'both');

// Create a gradient string
const gradient = createGradientString(['#FF0000', '#00FF00', '#0000FF']);

// Get appropriate text color for a background
const textColor = getTextColor('#3366FF'); // Returns black or white based on contrast

// Check if a color combination meets WCAG accessibility standards
const isAccessible = isWCAGCompliant('#3366FF', '#FFFFFF');

// Get the contrast ratio between two colors
const ratio = getContrastRatio('#3366FF', '#FFFFFF');

// Validate an array of color strings (all must be 6-digit hex colors)
const isValid = testColorsValid(['#FF0000', '#00FF00', '#0000FF']); // Returns true
const isInvalid = testColorsValid(['#FF0000', 'invalid', 'rgb(0, 0, 0)']); // Returns false

// Lighten an array of colors by a specified amount (0-1)
const lightenedColors = lightenColors(['#FF0000', '#00FF00', '#0000FF'], 0.3);

// Darken an array of colors by a specified amount (0-1)
const darkenedColors = darkenColors(['#FF0000', '#00FF00', '#0000FF'], 0.4);

// Use preset color themes
const sunsetGradient = DEFAULT_THEMES.SUNSET;
```

## API Reference

### Functions

- `getAdaptedColor(color: string, theme: Theme): string`
- `adaptGradientColors(colors: string[], theme: Theme): string[]`
- `createGradientString(colors: string[]): string`
- `getTextColor(bgColor: string): string`
- `isWCAGCompliant(backgroundColor: string, textColor: string): boolean`
- `getContrastRatio(color1: string, color2: string): number`
- `testColorsValid(colors: string[]): boolean`
- `lightenColors(colors: string[], amount: number): string[]`
- `darkenColors(colors: string[], amount: number): string[]`

### Constants

- `DEFAULT_THEMES`: Predefined color palettes and gradients

### Types

- `Theme`: 'dark' | 'light' | 'both'

## License

MIT