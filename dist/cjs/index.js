"use strict";
/**
 * Dark Light Colors - A React library for color management with dark/light mode adaptations
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_THEMES = exports.testColorsValid = exports.getContrastRatio = exports.isWCAGCompliant = exports.getTextColor = exports.createGradientString = exports.adaptGradientColors = exports.getAdaptedColor = void 0;
// Export utility functions
var utils_js_1 = require("./utils.js");
Object.defineProperty(exports, "getAdaptedColor", { enumerable: true, get: function () { return utils_js_1.getAdaptedColor; } });
Object.defineProperty(exports, "adaptGradientColors", { enumerable: true, get: function () { return utils_js_1.adaptGradientColors; } });
Object.defineProperty(exports, "createGradientString", { enumerable: true, get: function () { return utils_js_1.createGradientString; } });
Object.defineProperty(exports, "getTextColor", { enumerable: true, get: function () { return utils_js_1.getTextColor; } });
Object.defineProperty(exports, "isWCAGCompliant", { enumerable: true, get: function () { return utils_js_1.isWCAGCompliant; } });
Object.defineProperty(exports, "getContrastRatio", { enumerable: true, get: function () { return utils_js_1.getContrastRatio; } });
Object.defineProperty(exports, "testColorsValid", { enumerable: true, get: function () { return utils_js_1.testColorsValid; } });
// Export constants and types
var constants_js_1 = require("./constants.js");
Object.defineProperty(exports, "DEFAULT_THEMES", { enumerable: true, get: function () { return constants_js_1.DEFAULT_THEMES; } });
