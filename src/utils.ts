import tinycolor from 'tinycolor2';
import type { Theme, Intensity } from './constants.js';

/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * using a smooth curve without harsh transitions
 * @param color The color to adapt
 * @param theme The theme mode ('dark' or 'light')
 * @param intensity The intensity of the adaptation ('strong' or 'mild', defaults to 'strong')
 */
export const getAdaptedColor = (color: string, theme: Theme, intensity: Intensity = 'strong'): string => {
  const colorObj = tinycolor(color);
  const brightness = colorObj.getBrightness(); // 0-255
  const hsl = colorObj.toHsl();

  // For mild intensity, apply very minimal adjustments across all colors
  if (intensity === 'mild') {
    let newLightness;

    if (theme === 'dark') {
      // In dark mode: completely smooth curve across entire brightness range
      // Use a continuous function instead of multiple conditions

      // Get normalized values for calculations
      const normalizedLightness = hsl.l;                   // 0-1 scale

      // For dark mode, we need a smooth curve that:
      // - Makes very dark colors (black/near-black) significantly lighter (around 0.65-0.7)
      // - Gradually reduces the lightening effect as original lightness increases
      // - Transitions smoothly to slight darkening for very bright colors
      // - Maintains original lightness in the mid-range

      // Define color adjustment curve parameters
      const darkPeak = 0.65;     // Max lightness for darkest colors
      const midPoint = 0.6;      // Transition point between lightening and darkening
      const brightTrough = -0.4; // Max darkening for brightest colors - increased for better white text contrast

      // Calculate a smooth curve using a blend of sigmoid and linear functions

      // For dark colors: smooth curve that peaks at darkPeak for black and decreases
      const darkEffect = darkPeak * (1 - Math.pow(normalizedLightness, 0.8));

      // For bright colors: smooth curve that increases darkening as brightness increases
      // Adjusted to darken high-luminosity colors more significantly for better white text contrast
      const brightEffect = brightTrough * Math.max(0, Math.pow((normalizedLightness - midPoint) / (1 - midPoint), 1.7));

      // Blend the curves using a smooth transition
      let adjustment;

      if (normalizedLightness < midPoint) {
        // Primarily affected by darkEffect (lightening)
        const blendFactor = Math.pow(normalizedLightness / midPoint, 1.5);
        adjustment = darkEffect * (1 - blendFactor);
      } else {
        // Transition to brightEffect (darkening)
        const blendFactor = Math.pow((normalizedLightness - midPoint) / (1 - midPoint), 1.2);
        adjustment = brightEffect * blendFactor;
      }

      // Apply adjustment with a slight bias toward original colors in the middle range
      // This creates a more natural transition
      const midRangeDamping = 4 * (normalizedLightness * (1 - normalizedLightness)); // Peaks at 0.5, approaches 0 at extremes
      const dampenedAdjustment = adjustment * (0.8 + 0.2 * (1 - midRangeDamping));

      // Calculate final lightness and ensure it stays in valid range
      newLightness = Math.max(0, Math.min(1, normalizedLightness + dampenedAdjustment));

      // Apply additional enhancement for very dark colors to ensure readability
      // This smoothly blends into the main curve
      if (brightness < 20) {
        const darkBoost = (1 - brightness / 40) * 0.1;
        newLightness = Math.min(0.7, newLightness + darkBoost);
      }

      // Apply additional darkening for very bright colors to ensure better text contrast
      // Especially important for white text on light backgrounds in dark mode
      if (brightness > 220) {
        const brightReduction = ((brightness - 220) / 35) * 0.15;
        newLightness = Math.max(0.3, newLightness - brightReduction);
      }

      // Special handling for yellow/yellow-green/yellow-orange colors, which often have poor contrast with white text
      // Yellow and adjacent hues range from approximately 30-80 in HSL
      if (hsl.h >= 30 && hsl.h <= 80) {
        // For yellows, we want to darken more aggressively in dark mode for better text contrast
        // Especially for mid-to-high brightness yellows

        // Calculate how "yellow" the color is (peak at hue 60, taper off at edges)
        const distanceFromPureYellow = Math.abs(hsl.h - 60);
        const yellowness = Math.max(0, 1 - distanceFromPureYellow / 30);

        // Apply stronger adjustment to colors closer to pure yellow (hue 60)
        const yellowAdjustment = 0.25 * yellowness * Math.min(1, brightness / 200);
        newLightness = Math.max(0.25, newLightness - yellowAdjustment);
      }
    } else {
      // In light mode: completely smooth curve across entire brightness range
      // Use a continuous function instead of multiple conditions

      // Get normalized values for calculations
      const normalizedLightness = hsl.l;                   // 0-1 scale

      // For light mode, we need a smooth curve that:
      // - Makes very dark colors (black/near-black) significantly lighter (around 0.6-0.7)
      // - Gradually reduces the lightening effect as original lightness increases
      // - Transitions smoothly to slight darkening for very bright colors
      // - Has minimal effect on mid-tone colors

      // Define color adjustment curve parameters
      const darkPeak = 0.65;     // Max lightness for darkest colors
      const midPoint = 0.5;      // Transition point between lightening and darkening
      const brightTrough = -0.15; // Max darkening for brightest colors

      // Calculate a smooth curve using a blend of exponential and quadratic functions

      // For dark colors: smooth curve that peaks at darkPeak for black and decreases
      const darkEffect = darkPeak * (1 - Math.pow(normalizedLightness / midPoint, 0.7));

      // For bright colors: smooth curve that increases darkening as brightness increases
      const brightEffect = brightTrough * Math.pow(Math.max(0, (normalizedLightness - midPoint) / (1 - midPoint)), 1.5);

      // Blend the curves using a smooth transition based on lightness
      let adjustment;

      if (normalizedLightness < midPoint) {
        // For dark colors: primarily affected by darkEffect (lightening)
        // Create a smooth curve that gives maximum lightening to black
        const blendFactor = Math.pow(normalizedLightness / midPoint, 2);
        adjustment = darkEffect * (1 - blendFactor);
      } else {
        // For light colors: transition to brightEffect (darkening)
        // Create a gentle curve that gradually increases darkening for lighter colors
        const blendFactor = Math.pow((normalizedLightness - midPoint) / (1 - midPoint), 1.5);
        adjustment = brightEffect * blendFactor;
      }

      // Add mid-range damping to preserve original colors better in the middle tones
      const midRangeDamping = 4 * (normalizedLightness * (1 - normalizedLightness)); // Peaks at 0.5
      const dampingFactor = 0.7 + (0.3 * midRangeDamping);

      // Calculate final lightness with damping effect
      newLightness = Math.max(0, Math.min(1, normalizedLightness + adjustment * dampingFactor));

      // Apply additional enhancement for very dark colors to improve text readability on dark backgrounds
      if (brightness < 20) {
        // Extra boost for extremely dark colors (near-black)
        const darkBoost = (1 - brightness / 30) * 0.15;
        newLightness = Math.min(0.75, newLightness + darkBoost);
      }
    }

    return tinycolor({
      h: hsl.h,
      s: hsl.s, // Preserve original saturation
      l: newLightness
    }).toString();
  }

  // Normalize brightness to 0-1 range
  const normalizedBrightness = brightness / 255;

  if (theme === 'dark') {
    // DARK MODE ADAPTATION

    // For dark mode with strong intensity, we want:
    // - Black (#000, brightness=0) → White (#FFF, lightness=1.0)
    // - Dark colors (low brightness) → Lighter colors
    // - Mid-tone colors → Slight lightening
    // - White and very light colors → Stay as they are
    let targetLightness;

    // Only strong intensity goes through this path now
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

    // For light mode with strong intensity, we want:
    // - White (#FFF, brightness=255) → Medium-dark gray
    // - Light colors (high brightness) → Moderately darker colors
    // - Mid-tone colors → Slight darkening
    // - Black and very dark colors → Stay as they are

    let targetLightness;

    // Only strong intensity goes through this path now
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
export const adaptGradientColors = (colors: string[], theme: Theme, intensity: Intensity = 'strong'): string[] => {
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
