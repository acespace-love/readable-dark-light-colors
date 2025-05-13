import type { Theme, Intensity } from './constants.js';
/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * using a smooth curve without harsh transitions
 * @param color The color to adapt
 * @param theme The theme mode ('dark' or 'light')
 * @param intensity The intensity of the adaptation ('strong' or 'mild', defaults to 'strong')
 */
export declare const getAdaptedColor: (color: string, theme: Theme, intensity?: Intensity) => string;
/**
 * Adapts all gradient colors for the current mode
 * @param colors Array of colors to adapt
 * @param theme The theme mode ('dark' or 'light')
 * @param intensity The intensity of the adaptation ('strong' or 'mild', defaults to 'strong')
 */
export declare const adaptGradientColors: (colors: string[], theme: Theme, intensity?: Intensity) => string[];
/**
 * Creates a CSS gradient string from an array of colors
 * If only one color is provided, it will be duplicated to create a gradient
 */
export declare const createGradientString: (colors: string[]) => string;
/**
 * Calculates the best contrasting text color (black or white) for a given background color
 * based on WCAG guidelines
 */
export declare const getTextColor: (bgColor: string) => string;
/**
 * Checks if a color combination meets WCAG AA contrast standards
 */
export declare const isWCAGCompliant: (backgroundColor: string, textColor: string) => boolean;
/**
 * Tests if an array of colors contains only valid hex colors with 6 digits
 * @param colors Array of color strings to validate
 * @returns True if all colors are valid hex colors (format: #RRGGBB)
 */
export declare const testColorsValid: (colors: string[]) => boolean;
/**
 * Gets the contrast ratio between two colors
 */
export declare const getContrastRatio: (color1: string, color2: string) => number;
