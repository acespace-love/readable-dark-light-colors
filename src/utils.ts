import tinycolor from 'tinycolor2';
import type { ThemeMode } from './constants.js';

/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * using a smooth curve without harsh transitions
 * @param color The color to adapt
 * @param theme The theme mode ('dark' or 'light')
 * @param intensity The intensity of the adaptation ('strong' or 'mild', defaults to 'strong')
 */
export const getAdaptedColor = (color: string, theme: ThemeMode, intensity: 'strong' | 'mild' = 'strong'): string => {
  const colorObj = tinycolor(color);
  const brightness = colorObj.getBrightness(); // 0-255
  const hsl = colorObj.toHsl();

  // If using mild intensity and the color is in mid-luminance range, apply minimal adaptation
  if (intensity === 'mild' && hsl.l > 0.3 && hsl.l < 0.7) {
    // For mid-luminance colors in mild mode, make minimal adjustments
    const minAdjustment = theme === 'dark'
      ? Math.min(Math.max(hsl.l + 0.1, hsl.l), 0.65) // Slightly lighter in dark mode
      : Math.max(Math.min(hsl.l - 0.1, hsl.l), 0.35); // Slightly darker in light mode

    return tinycolor({
      h: hsl.h,
      s: hsl.s,
      l: minAdjustment
    }).toString();
  }

  // Normalize brightness to 0-1 range
  const normalizedBrightness = brightness / 255;

  if (theme === 'dark') {
    // DARK MODE ADAPTATION

    // For dark mode, we want:
    // - Black (#000, brightness=0) → White (#FFF, lightness=1.0) or Gray for mild
    // - Dark colors (low brightness) → Lighter colors
    // - Mid-tone colors → Slight lightening
    // - White and very light colors → Stay as they are

    // Calculate a smooth curve based on intensity
    let targetLightness;

    if (intensity === 'strong') {
      // STRONG INTENSITY (original behavior)
      if (brightness < 10) {
        // Handle pure black or very close to black
        // Map 0→1.0 (pure white) through 10→0.9
        targetLightness = 1.0 - (brightness / 10) * 0.1;
      } else if (brightness < 50) {
        // Handle very dark colors
        targetLightness = 0.95 - (normalizedBrightness * 2) * 0.4;
      } else if (brightness < 200) {
        // Handle most colors with smooth transition
        // Map 50→0.55 through 200→0.10
        targetLightness = 0.55 - (((brightness - 50) / 150) * 0.45);
      } else {
        // Keep very bright colors as they are
        return color;
      }
    } else {
      // MILD INTENSITY (extremely subtle contrast)
      if (brightness < 10) {
        // Handle pure black or very close to black - make it darker gray
        // Map 0→0.45 (darker gray) through 10→0.43
        targetLightness = 0.45 - (brightness / 10) * 0.02;
      } else if (brightness < 50) {
        // Handle very dark colors - minimal lightening
        targetLightness = 0.43 - (normalizedBrightness * 2) * 0.05;
      } else if (brightness < 200) {
        // Handle most colors with extremely gentle transition
        // Map 50→0.38 through 200→0.3
        targetLightness = 0.38 - (((brightness - 50) / 150) * 0.08);
      } else {
        // Keep very bright colors almost as they are - minimal adjustment
        return brightness > 230 ? color : tinycolor({
          h: hsl.h,
          s: hsl.s,
          l: Math.min(0.85, hsl.l + 0.05)
        }).toString();
      }
    }

    // Make sure we don't go below original lightness for light colors
    targetLightness = Math.max(targetLightness, hsl.l);

    // Create the color with new lightness
    return tinycolor({
      h: hsl.h,
      s: hsl.s, // Preserve original saturation
      l: targetLightness
    }).toString();

  } else {
    // LIGHT MODE ADAPTATION

    // For light mode, we want:
    // - White (#FFF, brightness=255) → Medium-dark gray (not too dark) or light gray for mild
    // - Light colors (high brightness) → Moderately darker colors
    // - Mid-tone colors → Slight darkening
    // - Black and very dark colors → Stay as they are

    let targetLightness;

    if (intensity === 'strong') {
      // STRONG INTENSITY (original behavior)
      if (brightness > 250) {
        // Handle pure white or very close to white
        // Map 255→0.05 (almost black) through 250→0.15
        targetLightness = 0.05 + ((255 - brightness) / 5) * 0.10;
      } else if (brightness > 240) {
        // Handle near-white colors
        // Map 250→0.15 through 240→0.25
        targetLightness = 0.15 + ((250 - brightness) / 10) * 0.10;
      } else if (brightness > 200) {
        // Handle very light colors
        // Map 240→0.25 through 200→0.35
        targetLightness = 0.25 + ((240 - brightness) / 40) * 0.10;
      } else if (brightness > 50) {
        // Handle most colors with smooth transition
        // Map 200→0.35 through 50→0.55
        targetLightness = 0.35 + ((200 - brightness) / 150) * 0.20;
      } else {
        // Keep very dark colors as they are
        return color;
      }
    } else {
      // MILD INTENSITY (extremely subtle contrast)
      if (brightness > 250) {
        // Handle pure white or very close to white - slightly darker gray
        // Map 255→0.55 (medium light gray) through 250→0.57
        targetLightness = 0.55 + ((255 - brightness) / 5) * 0.02;
      } else if (brightness > 240) {
        // Handle near-white colors
        // Map 250→0.57 through 240→0.58
        targetLightness = 0.57 + ((250 - brightness) / 10) * 0.01;
      } else if (brightness > 200) {
        // Handle very light colors
        // Map 240→0.58 through 200→0.59
        targetLightness = 0.58 + ((240 - brightness) / 40) * 0.01;
      } else if (brightness > 50) {
        // Handle most colors with extremely gentle transition
        // Map 200→0.59 through 50→0.62
        targetLightness = 0.59 + ((200 - brightness) / 150) * 0.03;
      } else {
        // Keep very dark colors almost as they are - minimal adjustment
        return brightness < 20 ? color : tinycolor({
          h: hsl.h,
          s: hsl.s,
          l: Math.max(0.15, hsl.l - 0.05)
        }).toString();
      }
    }

    // Make sure we don't go above original lightness for dark colors
    targetLightness = Math.min(targetLightness, hsl.l);

    // Create the color with new lightness
    return tinycolor({
      h: hsl.h,
      s: hsl.s, // Preserve original saturation
      l: targetLightness
    }).toString();
  }
};

/**
 * Adapts all gradient colors for the current mode
 * @param colors Array of colors to adapt
 * @param theme The theme mode ('dark' or 'light')
 * @param intensity The intensity of the adaptation ('strong' or 'mild', defaults to 'strong')
 */
export const adaptGradientColors = (colors: string[], theme: ThemeMode, intensity: 'strong' | 'mild' = 'strong'): string[] => {
  return colors.map((color) => getAdaptedColor(color, theme, intensity));
};

/**
 * Creates a CSS gradient string from an array of colors
 * If only one color is provided, it will be duplicated to create a gradient
 */
export const createGradientString = (colors: string[]): string => {
  // Ensure we have at least 2 colors for a gradient
  if (colors.length === 0) {
    return 'transparent';
  }

  if (colors.length === 1) {
    // For a single color, duplicate it to create a solid gradient
    return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`;
  }

  const colorStops = colors
    .map((color, index) => {
      const percentage = (index / (colors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    })
    .join(', ');

  return `linear-gradient(to right, ${colorStops})`;
};

/**
 * Calculates the best contrasting text color (black or white) for a given background color
 * based on WCAG guidelines
 */
export const getTextColor = (bgColor: string): string => {
  const color = tinycolor(bgColor);
  // Calculate contrast ratio with white and black
  const contrastWithWhite = tinycolor.readability(color, '#ffffff');
  const contrastWithBlack = tinycolor.readability(color, '#000000');

  // WCAG AA requires a contrast ratio of at least 4.5:1 for normal text
  // Return the color with better contrast
  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';
};

/**
 * Checks if a color combination meets WCAG AA contrast standards
 */
export const isWCAGCompliant = (backgroundColor: string, textColor: string): boolean => {
  const contrastRatio = tinycolor.readability(backgroundColor, textColor);
  // WCAG AA standard requires a minimum contrast ratio of 4.5:1 for normal text
  return contrastRatio >= 4.5;
};

/**
 * Tests if an array of colors contains only valid hex colors with 6 digits
 * @param colors Array of color strings to validate
 * @returns True if all colors are valid hex colors (format: #RRGGBB)
 */
export const testColorsValid = (colors: string[]): boolean => {
  const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
  return !!colors && colors.length > 0 && colors.filter(color => hexColorRegex.test(color)).length === colors.length
}

/**
 * Gets the contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  return tinycolor.readability(color1, color2);
};
