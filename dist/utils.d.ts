import type { ThemeMode } from './constants.js';
/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * using a smooth curve without harsh transitions
 */
export declare const getAdaptedColor: (color: string, theme: ThemeMode) => string;
/**
 * Adapts all gradient colors for the current mode
 */
export declare const adaptGradientColors: (colors: string[], theme: ThemeMode) => string[];
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
 * Gets the contrast ratio between two colors
 */
export declare const getContrastRatio: (color1: string, color2: string) => number;
