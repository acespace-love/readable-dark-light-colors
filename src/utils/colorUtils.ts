import tinycolor from 'tinycolor2';

/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * while preserving more of the original color's character
 */
export const getAdaptedColor = (color: string, theme: 'dark' | 'light'): string => {
  const colorObj = tinycolor(color);
  const brightness = colorObj.getBrightness();
  const hsl = colorObj.toHsl();
  const isDark = brightness < 128;

  // Special case for colors that are very close to white or black
  if (brightness > 240) {
    // Very light colors (white or near-white)
    return theme === 'dark'
      ? color // Keep white as white in dark mode
      : tinycolor({ h: hsl.h, s: hsl.s, l: 0.25 }).toString(); // Make it dark but not too dark in light mode
  }

  if (brightness < 30) {
    // Very dark colors (black or near-black)
    return theme === 'dark'
      ? tinycolor({ h: hsl.h, s: hsl.s, l: 0.75 }).toString() // Make it light but not too light in dark mode
      : color; // Keep black as black in light mode
  }

  if (theme === 'dark') {
    // For dark mode backgrounds
    if (isDark) {
      // Reduce the lightening intensity for dark colors
      const lightenAmount = Math.min(18, (0.8 - hsl.l) * 35);
      const saturateAmount = Math.min(5, 10 - hsl.s * 8);

      // Keep more of the original color character by using smaller adjustments
      return tinycolor(color).lighten(lightenAmount).saturate(saturateAmount).toString();
    } else {
      // Light colors might need slight adjustment in dark mode
      return tinycolor(color).lighten(3).saturate(3).toString();
    }
  } else {
    // For light mode backgrounds
    if (!isDark) {
      // Reduce the darkening intensity for light colors
      const darkenAmount = Math.min(18, (hsl.l - 0.2) * 35);
      const saturateAmount = Math.min(5, 10 - hsl.s * 8);

      // Keep more of the original color character by using smaller adjustments
      return tinycolor(color).darken(darkenAmount).saturate(saturateAmount).toString();
    } else {
      // Dark colors might need slight adjustment in light mode
      return tinycolor(color).darken(3).saturate(3).toString();
    }
  }
};

/**
 * Adapts all gradient colors for the current mode
 */
export const adaptGradientColors = (colors: string[], theme: 'dark' | 'light'): string[] => {
  return colors.map((color) => getAdaptedColor(color, theme));
};

/**
 * Creates a CSS gradient string from an array of colors
 */
export const createGradientString = (colors: string[]): string => {
  if (colors.length === 1) {
    // For a single color, just return the color itself (no gradient)
    return colors[0];
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
 * Gets the contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  return tinycolor.readability(color1, color2);
};
