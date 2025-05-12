"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContrastRatio = exports.isWCAGCompliant = exports.getTextColor = exports.createGradientString = exports.adaptGradientColors = exports.getAdaptedColor = void 0;
const tinycolor2_1 = __importDefault(require("tinycolor2"));
/**
 * Adapts a color for dark or light mode based on its brightness and saturation,
 * while preserving more of the original color's character
 */
const getAdaptedColor = (color, theme) => {
    const colorObj = (0, tinycolor2_1.default)(color);
    const brightness = colorObj.getBrightness();
    const hsl = colorObj.toHsl();
    const isDark = brightness < 128;
    // Special case for colors that are very close to white or black
    if (brightness > 240) {
        // Very light colors (white or near-white)
        return theme === 'dark'
            ? color // Keep white as white in dark mode
            : (0, tinycolor2_1.default)({ h: hsl.h, s: hsl.s, l: 0.25 }).toString(); // Make it dark but not too dark in light mode
    }
    if (brightness < 30) {
        // Very dark colors (black or near-black)
        return theme === 'dark'
            ? (0, tinycolor2_1.default)({ h: hsl.h, s: hsl.s, l: 0.75 }).toString() // Make it light but not too light in dark mode
            : color; // Keep black as black in light mode
    }
    if (theme === 'dark') {
        // For dark mode backgrounds
        if (isDark) {
            // Reduce the lightening intensity for dark colors
            const lightenAmount = Math.min(18, (0.8 - hsl.l) * 35);
            const saturateAmount = Math.min(5, 10 - hsl.s * 8);
            // Keep more of the original color character by using smaller adjustments
            return (0, tinycolor2_1.default)(color).lighten(lightenAmount).saturate(saturateAmount).toString();
        }
        else {
            // Light colors might need slight adjustment in dark mode
            return (0, tinycolor2_1.default)(color).lighten(3).saturate(3).toString();
        }
    }
    else {
        // For light mode backgrounds
        if (!isDark) {
            // Reduce the darkening intensity for light colors
            const darkenAmount = Math.min(18, (hsl.l - 0.2) * 35);
            const saturateAmount = Math.min(5, 10 - hsl.s * 8);
            // Keep more of the original color character by using smaller adjustments
            return (0, tinycolor2_1.default)(color).darken(darkenAmount).saturate(saturateAmount).toString();
        }
        else {
            // Dark colors might need slight adjustment in light mode
            return (0, tinycolor2_1.default)(color).darken(3).saturate(3).toString();
        }
    }
};
exports.getAdaptedColor = getAdaptedColor;
/**
 * Adapts all gradient colors for the current mode
 */
const adaptGradientColors = (colors, theme) => {
    return colors.map((color) => (0, exports.getAdaptedColor)(color, theme));
};
exports.adaptGradientColors = adaptGradientColors;
/**
 * Creates a CSS gradient string from an array of colors
 */
const createGradientString = (colors) => {
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
 * Gets the contrast ratio between two colors
 */
const getContrastRatio = (color1, color2) => {
    return tinycolor2_1.default.readability(color1, color2);
};
exports.getContrastRatio = getContrastRatio;
