/**
 * Predefined color themes for use across the application.
 * Each theme consists of one or more colors that can be used for gradients.
 */
export const displayNameThemes: Record<string, string[]> = {
  DEFAULT: ['#CCCCCC'],
  RED: ['#EF4444'], // text-red-500
  PINK: ['#EC4899'], // text-pink-400
  ORANGE: ['#F97316'], // text-orange-400
  YELLOW: ['#EAB308'], // text-yellow-400
  EMERALD: ['#10B981'], // text-emerald-400
  BLUE: ['#60A5FA'], // text-blue-400
  VIOLET: ['#8B5CF6'], // text-violet-400
  PURPLE: ['#A855F7'], // text-purple-400
  COTTON_CANDY: ['#F472B6', '#C084FC', '#818CF8'], // from-pink-300 via-purple-300 to-indigo-400
  SKY: ['#0EA5E9', '#0284C7'], // from-sky-400 to-sky-500
  SUNSET: ['#F87171', '#FB923C', '#F87171'], // from-red-400 via-orange-400 to-red-400
  DRUMSTICK: ['#EAB308', '#EC4899'], // from-yellow-400 to-pink-500
  RAINBOW: ['#F59E0B', '#10B981', '#EC4899'], // from-yellow-500 via-green-400 to-pink-500
  RAINBOW_V2: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0066FF'], // bright rainbow with 5 colors (red, orange, yellow, green, blue)
};

/**
 * Default color for new gradient colors.
 */
export const DEFAULT_COLOR = '#646cff';

/**
 * Default maximum number of colors allowed in a gradient.
 */
export const MAX_GRADIENT_COLORS = 6;

/**
 * Default username for personalization.
 */
export const DEFAULT_USERNAME = 'GradientUser123';

/**
 * Local storage keys used throughout the application.
 */
export const STORAGE_KEYS = {
  DARK_MODE: 'theme-dark-mode',
  USER_COLOR: 'theme-user-color',
  USERNAME: 'theme-username',
  GRADIENT_COLORS: 'theme-gradient-colors',
};

/**
 * Theme modes available in the application.
 */
export type ThemeMode = 'dark' | 'light';

// createGradientString moved to colorUtils.ts
