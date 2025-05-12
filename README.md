# Dark Light Colours

A React library for managing colors in both dark and light modes with accessibility support.

## Features

- 🌓 **Dark/Light Mode Adaptation**: Automatically adapts colors for dark or light mode
- 🎨 **Color Presets**: Ready-to-use color themes and gradients
- 🧩 **Modular Components**: Mix and match components to build your UI
- ♿ **Accessibility**: WCAG compliance checking and contrast ratio calculations
- 🔍 **Color Testing**: Preview how colors look in both dark and light modes
- 🌈 **Gradient Support**: Build beautiful gradients with an intuitive UI
- 🧰 **Tailwind Integration**: Works seamlessly with Tailwind CSS

## Installation

```bash
npm install dark-light-colours
# or
yarn add dark-light-colours
```

## Requirements

- React 18+ or 19+
- Tailwind CSS 3+ or 4+

## Usage

```jsx
import React, { useState } from 'react';
import { 
  ThemeToggle, 
  GradientBuilderWithPresets,
  DEFAULT_THEMES, 
  DEFAULT_COLOR 
} from 'dark-light-colours';
import 'dark-light-colours/styles';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userColor, setUserColor] = useState(DEFAULT_THEMES.DEFAULT[0]);
  const [gradientColors, setGradientColors] = useState([DEFAULT_COLOR]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-zinc-900 min-h-screen p-4">
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <GradientBuilderWithPresets
          gradientColors={gradientColors}
          setGradientColors={setGradientColors}
          setUserColor={setUserColor}
          maximumColorCount={MAX_GRADIENT_COLORS}
        />
      </div>
    </div>
  );
}
```

## Components

### ThemeToggle

A simple toggle switch for dark/light mode switching.

```jsx
<ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
```

### GradientBuilderWithPresets

A component for building gradients with preset color options.

```jsx
<GradientBuilderWithPresets
  gradientColors={gradientColors}
  setGradientColors={setGradientColors}
  setUserColor={setUserColor}
  maximumColorCount={MAX_GRADIENT_COLORS}
/>
```

### ColorPresets

A component that displays color presets for quick selection.

```jsx
<ColorPresets
  setUserColor={setUserColor}
  setGradientColors={setGradientColors}
/>
```

### GradientControls

Advanced color controls with WCAG compliance indicators.

```jsx
<GradientControls
  userColor={userColor}
  setUserColor={setUserColor}
  gradientColors={gradientColors}
  setGradientColors={setGradientColors}
  mode={isDarkMode ? 'dark' : 'light'}
/>
```

### ThemePreview

Previews components in both dark and light modes.

```jsx
<ThemePreview
  username={username}
  selectedColor={userColor}
  gradientColors={gradientColors}
  mode="light" // or "dark"
/>
```

### ContainerWithHeader

A container with a customizable gradient header.

```jsx
<ContainerWithHeader
  gradientColors={gradientColors}
  isDarkMode={isDarkMode}
  title="My Container"
>
  Content goes here
</ContainerWithHeader>
```

## Utility Functions

### Color Adaptation

```jsx
import { getAdaptedColor, adaptGradientColors } from 'dark-light-colours';

// Adapt a single color for dark mode
const darkModeColor = getAdaptedColor('#3b82f6', 'dark');

// Adapt an array of gradient colors
const darkModeGradient = adaptGradientColors(['#3b82f6', '#ec4899'], 'dark');
```

### Gradients

```jsx
import { createGradientString } from 'dark-light-colours';

// Create a CSS gradient string
const gradient = createGradientString(['#3b82f6', '#ec4899']);
// Result: "linear-gradient(to right, #3b82f6 0%, #ec4899 100%)"

// Use in inline styles
<div style={{ background: createGradientString(colors) }} />
```

### Accessibility

```jsx
import { 
  getTextColor, 
  isWCAGCompliant,
  getContrastRatio 
} from 'dark-light-colours';

// Get the best contrasting text color (black or white)
const textColor = getTextColor('#3b82f6');

// Check if a color combination meets WCAG AA standards
const isCompliant = isWCAGCompliant('#3b82f6', '#ffffff');

// Get the contrast ratio between two colors
const ratio = getContrastRatio('#3b82f6', '#ffffff');
```

## Preset Themes

```jsx
import { DEFAULT_THEMES } from 'dark-light-colours';

// Available themes
const { DEFAULT, RED, BLUE, COTTON_CANDY, RAINBOW } = DEFAULT_THEMES;

// Usage
<div style={{ background: DEFAULT_THEMES.BLUE[0] }} />
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Your Name]