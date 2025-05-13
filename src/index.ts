/**
 * Dark Light Colors - A React library for color management with dark/light mode adaptations
 *
 * @packageDocumentation
 */

// Export utility functions
export {
  getAdaptedColor,
  adaptGradientColors,
  createGradientString,
  getTextColor,
  isWCAGCompliant,
  getContrastRatio,
  testColorsValid
} from './utils.js';

// Export constants and types
export { DEFAULT_THEMES, type ThemeMode } from './constants.js';
