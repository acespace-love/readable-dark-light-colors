"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.darkenColors = exports.lightenColors = exports.getContrastRatio = exports.testColorsValid = exports.isWCAGCompliant = exports.getTextColor = exports.createGradientString = exports.adaptGradientColors = exports.getAdaptedColor = void 0;
const tinycolor2_1 = __importDefault(require("tinycolor2"));
/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * using a smooth curve without harsh transitions
 * @param color The color to adapt
 * @param theme The theme mode ('dark', 'light', or 'both')
 */
const getAdaptedColor = (color, theme) => {
    const colorObj = (0, tinycolor2_1.default)(color);
    const brightness = colorObj.getBrightness(); // 0-255
    const hsl = colorObj.toHsl();
    // Normalize brightness to 0-1 range
    const normalizedBrightness = brightness / 255;
    // For 'both' theme, we need to find a middle ground that works in both modes
    if (theme === 'both') {
        // For 'both' mode, we want to avoid extremes - no very dark or very light colors
        // Target the middle range that will have enough contrast in both light and dark contexts
        // Check if the color is already in a good range for both themes
        const contrastWithWhite = tinycolor2_1.default.readability(colorObj, '#ffffff');
        const contrastWithBlack = tinycolor2_1.default.readability(colorObj, '#000000');
        // If the color already has good contrast with both white and black (at least 4.5:1 WCAG AA),
        // we can use it as is
        if (contrastWithWhite >= 4.5 && contrastWithBlack >= 4.5) {
            return color;
        }
        // Otherwise, adjust the color to improve its contrast with both backgrounds
        let targetLightness;
        // Very dark colors: brighten to mid-tones
        if (brightness < 50) {
            // Mid-dark range (around 40-50% lightness)
            targetLightness = 0.4 + ((50 - brightness) / 50) * 0.1;
        }
        // Very light colors: darken to mid-tones
        else if (brightness > 200) {
            // Mid-light range (around 50-60% lightness)
            targetLightness = 0.6 - ((brightness - 200) / 55) * 0.1;
        }
        // Mid-tone colors: adjust slightly toward middle range (45-55% lightness)
        else {
            // If already in mid range, make minimal adjustments
            const midPoint = 0.5; // Target middle lightness
            const currentDistance = Math.abs(hsl.l - midPoint);
            const adjustmentFactor = Math.min(currentDistance, 0.15); // Max 15% adjustment
            targetLightness = hsl.l > midPoint
                ? hsl.l - adjustmentFactor // Darken slightly if light
                : hsl.l + adjustmentFactor; // Brighten slightly if dark
        }
        // Ensure targetLightness is in the 0.4-0.6 range for optimal visibility in both modes
        targetLightness = Math.max(0.4, Math.min(0.6, targetLightness));
        return (0, tinycolor2_1.default)({
            h: hsl.h,
            s: Math.min(hsl.s, 0.8), // Slightly reduce saturation for better readability
            l: targetLightness
        }).toString();
    }
    else if (theme === 'dark') {
        // DARK MODE ADAPTATION
        // For dark mode, we want:
        // - Black (#000, brightness=0) → White (#FFF, lightness=1.0)
        // - Dark colors (low brightness) → Lighter colors
        // - Mid-tone colors → Slight lightening
        // - White and very light colors → Stay as they are
        let targetLightness;
        if (brightness < 10) {
            // Handle pure black or very close to black
            // Map 0→1.0 (pure white) through 10→0.9
            targetLightness = 1.0 - (brightness / 10) * 0.1;
        }
        else if (brightness < 50) {
            // Handle very dark colors
            targetLightness = 0.95 - (normalizedBrightness * 2) * 0.4;
        }
        else if (brightness < 200) {
            // Handle most colors with smooth transition
            // Map 50→0.55 through 200→0.10
            targetLightness = 0.55 - (((brightness - 50) / 150) * 0.45);
        }
        else {
            // Keep very bright colors as they are
            return color;
        }
        // Make sure we don't go below original lightness for light colors
        targetLightness = Math.max(targetLightness, hsl.l);
        // Create the color with new lightness
        return (0, tinycolor2_1.default)({
            h: hsl.h,
            s: hsl.s, // Preserve original saturation
            l: targetLightness
        }).toString();
    }
    else {
        // LIGHT MODE ADAPTATION
        // For light mode, we want:
        // - White (#FFF, brightness=255) → Medium-dark gray
        // - Light colors (high brightness) → Moderately darker colors
        // - Mid-tone colors → Slight darkening
        // - Black and very dark colors → Stay as they are
        let targetLightness;
        if (brightness > 250) {
            // Handle pure white or very close to white
            // Map 255→0.05 (almost black) through 250→0.15
            targetLightness = 0.05 + ((255 - brightness) / 5) * 0.10;
        }
        else if (brightness > 240) {
            // Handle near-white colors
            // Map 250→0.15 through 240→0.25
            targetLightness = 0.15 + ((250 - brightness) / 10) * 0.10;
        }
        else if (brightness > 200) {
            // Handle very light colors
            // Map 240→0.25 through 200→0.35
            targetLightness = 0.25 + ((240 - brightness) / 40) * 0.10;
        }
        else if (brightness > 50) {
            // Handle most colors with smooth transition
            // Map 200→0.35 through 50→0.55
            targetLightness = 0.35 + ((200 - brightness) / 150) * 0.20;
        }
        else {
            // Keep very dark colors as they are
            return color;
        }
        // Make sure we don't go above original lightness for dark colors
        targetLightness = Math.min(targetLightness, hsl.l);
        // Create the color with new lightness
        return (0, tinycolor2_1.default)({
            h: hsl.h,
            s: hsl.s, // Preserve original saturation
            l: targetLightness
        }).toString();
    }
};
exports.getAdaptedColor = getAdaptedColor;
/**
 * Adapts all gradient colors for the current mode
 * @param colors Array of colors to adapt
 * @param theme The theme mode ('dark', 'light', or 'both')
 */
const adaptGradientColors = (colors, theme) => {
    return colors.map((color) => (0, exports.getAdaptedColor)(color, theme));
};
exports.adaptGradientColors = adaptGradientColors;
/**
 * Creates a CSS gradient string from an array of colors
 * If only one color is provided, it will be duplicated to create a gradient
 */
const createGradientString = (colors) => {
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
exports.createGradientString = createGradientString;
/**
 * Calculates the best contrasting text color (black or white) for a given background color
 * based on WCAG guidelines
 */
const getTextColor = (bgColor) => {
    const color = (0, tinycolor2_1.default)(bgColor);
    // Calculate contrast ratio with white and black
    const contrastWithWhite = tinycolor2_1.default.readability(color, '#ffffff');
    const contrastWithBlack = tinycolor2_1.default.readability(color, '#000000');
    // WCAG AA requires a contrast ratio of at least 4.5:1 for normal text
    // Return the color with better contrast
    return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';
};
exports.getTextColor = getTextColor;
/**
 * Checks if a color combination meets WCAG AA contrast standards
 */
const isWCAGCompliant = (backgroundColor, textColor) => {
    const contrastRatio = tinycolor2_1.default.readability(backgroundColor, textColor);
    // WCAG AA standard requires a minimum contrast ratio of 4.5:1 for normal text
    return contrastRatio >= 4.5;
};
exports.isWCAGCompliant = isWCAGCompliant;
/**
 * Tests if an array of colors contains only valid hex colors with 6 digits
 * @param colors Array of color strings to validate
 * @returns True if all colors are valid hex colors (format: #RRGGBB)
 */
const testColorsValid = (colors) => {
    const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
    return !!colors && colors.length > 0 && colors.filter(color => hexColorRegex.test(color)).length === colors.length;
};
exports.testColorsValid = testColorsValid;
/**
 * Gets the contrast ratio between two colors
 */
const getContrastRatio = (color1, color2) => {
    return tinycolor2_1.default.readability(color1, color2);
};
exports.getContrastRatio = getContrastRatio;
/**
 * Lightens an array of colors by a specified amount
 * @param colors Array of color strings to lighten
 * @param amount Amount to lighten (0-1), where 0 is no change and 1 is maximum lightening
 * @returns New array of lightened colors
 */
const lightenColors = (colors, amount) => {
    // Clamp amount between 0 and 1
    const clampedAmount = Math.max(0, Math.min(1, amount));
    // Convert the 0-1 range to the 0-100 range that tinycolor.lighten() expects
    const lightenAmount = clampedAmount * 100;
    return colors.map(color => {
        return (0, tinycolor2_1.default)(color).lighten(lightenAmount).toString();
    });
};
exports.lightenColors = lightenColors;
/**
 * Darkens an array of colors by a specified amount
 * @param colors Array of color strings to darken
 * @param amount Amount to darken (0-1), where 0 is no change and 1 is maximum darkening
 * @returns New array of darkened colors
 */
const darkenColors = (colors, amount) => {
    // Clamp amount between 0 and 1
    const clampedAmount = Math.max(0, Math.min(1, amount));
    // Convert the 0-1 range to the 0-100 range that tinycolor.darken() expects
    const darkenAmount = clampedAmount * 100;
    return colors.map(color => {
        return (0, tinycolor2_1.default)(color).darken(darkenAmount).toString();
    });
};
exports.darkenColors = darkenColors;
