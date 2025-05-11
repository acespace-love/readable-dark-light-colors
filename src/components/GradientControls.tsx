import React from 'react';
import { getTextColor, getContrastRatio, isWCAGCompliant } from '../utils/colorUtils';

interface GradientControlsProps {
  userColor: string;
  setUserColor: (value: string) => void;
  gradientColors: string[];
  updateGradientColor: (index: number, newColor: string) => void;
  addColorToGradient: () => void;
  removeColorFromGradient: (index: number) => void;
  lightModeColor: string;
  darkModeColor: string;
  isDarkMode: boolean;
  darkModeGradientColors: string[];
  lightModeGradientColors: string[];
}

const GradientControls: React.FC<GradientControlsProps> = ({
  userColor,
  setUserColor,
  gradientColors,
  updateGradientColor,
  addColorToGradient,
  removeColorFromGradient,
  lightModeColor,
  darkModeColor,
  isDarkMode,
  darkModeGradientColors,
  lightModeGradientColors,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg my-4 border border-zinc-200 dark:border-zinc-700 shadow-md">
      <h3 className="text-lg font-semibold mb-2">Gradient Colors (1-6)</h3>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <label htmlFor="color-picker" className="text-sm">
          Color:{' '}
        </label>
        <input
          type="color"
          id="color-picker"
          value={userColor}
          onChange={(e) => setUserColor(e.target.value)}
          className="w-[40px] h-[30px] border-none rounded cursor-pointer bg-transparent"
        />
        <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
          {userColor}
        </code>
        <div className="flex ml-2 text-xs gap-1 items-center">
          <span className="text-gray-700 dark:text-gray-300">Light:</span>
          <div
            className="w-4 h-4 rounded-full border border-black/10"
            style={{ backgroundColor: lightModeColor }}
          ></div>
          <span className="text-gray-700 dark:text-gray-300">Dark:</span>
          <div
            className="w-4 h-4 rounded-full border border-black/10"
            style={{ backgroundColor: darkModeColor }}
          ></div>
        </div>
        <button
          className="ml-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white border-none rounded text-sm cursor-pointer font-medium transition-all duration-200 hover:opacity-90 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={addColorToGradient}
          disabled={gradientColors.length >= 6}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 my-4">
        {gradientColors.map((color, index) => {
          const contrast = getContrastRatio(color, getTextColor(color));
          const isWcagCompliant = isWCAGCompliant(color, getTextColor(color));

          return (
            <div
              key={index}
              className="flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.03] p-2 rounded relative text-xs"
            >
              <div
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              ></div>
              <input
                type="color"
                value={color}
                onChange={(e) => updateGradientColor(index, e.target.value)}
                className="w-[24px] h-[24px] border-none bg-transparent cursor-pointer p-0"
              />
              <div className="flex flex-col">
                <code className="font-mono text-xs">{color}</code>
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${isWcagCompliant ? 'bg-green-500' : 'bg-red-500'}`}
                  ></span>
                  <span className="text-gray-700 dark:text-gray-300 text-[10px]">
                    {contrast.toFixed(1)}
                  </span>
                </div>
              </div>
              {gradientColors.length > 1 && (
                <button
                  className="w-5 h-5 rounded-full border-none bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer ml-0.5 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                  onClick={() => removeColorFromGradient(index)}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="my-5">
        <div
          className="h-10 rounded w-full border border-black/10"
          style={
            gradientColors.length > 1
              ? {
                  backgroundImage: isDarkMode
                    ? `linear-gradient(to right, ${darkModeGradientColors.join(', ')})`
                    : `linear-gradient(to right, ${lightModeGradientColors.join(', ')})`,
                }
              : {
                  backgroundColor: isDarkMode
                    ? darkModeGradientColors[0]
                    : lightModeGradientColors[0],
                }
          }
        ></div>
      </div>
    </div>
  );
};

export default GradientControls;
