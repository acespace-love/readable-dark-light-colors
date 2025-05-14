import type { Theme } from './constants.js';
/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * using a smooth curve without harsh transitions
 * @param color The color to adapt
 * @param theme The theme mode ('dark', 'light', or 'both')
 */
export declare const getAdaptedColor: (color: string, theme: Theme) => string;
/**
 * Adapts all gradient colors for the current mode
 * @param colors Array of colors to adapt
 * @param theme The theme mode ('dark', 'light', or 'both')
 */
export declare const adaptGradientColors: (colors: string[], theme: Theme) => string[];
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
/**
 * Lightens an array of colors by a specified amount
 * @param colors Array of color strings to lighten
 * @param amount Amount to lighten (0-1), where 0 is no change and 1 is maximum lightening
 * @returns New array of lightened colors
 */
export declare const lightenColors: (colors: string[], amount: number) => string[];
/**
 * Darkens an array of colors by a specified amount
 * @param colors Array of color strings to darken
 * @param amount Amount to darken (0-1), where 0 is no change and 1 is maximum darkening
 * @returns New array of darkened colors
 */
export declare const darkenColors: (colors: string[], amount: number) => string[];
