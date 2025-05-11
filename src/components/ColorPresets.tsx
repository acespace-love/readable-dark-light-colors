import React from 'react';

interface ColorPresetsProps {
  setUserColor: (color: string) => void;
  setGradientColors: (colors: string[]) => void;
  setUsername: (username: string) => void;
  lightModeContrast: number;
  darkModeContrast: number;
  isLightModeWCAGCompliant: boolean;
  isDarkModeWCAGCompliant: boolean;
}

export const displayNameThemes: Record<string, readonly [string, string, ...string[]] | null> = {
  RED: ['#EF4444', '#EF4444'], // text-red-500
  PINK: ['#EC4899', '#EC4899'], // text-pink-400
  ORANGE: ['#F97316', '#F97316'], // text-orange-400
  YELLOW: ['#EAB308', '#EAB308'], // text-yellow-400
  EMERALD: ['#10B981', '#10B981'], // text-emerald-400
  BLUE: ['#60A5FA', '#60A5FA'], // text-blue-400
  VIOLET: ['#8B5CF6', '#8B5CF6'], // text-violet-400
  PURPLE: ['#A855F7', '#A855F7'], // text-purple-400
  COTTON_CANDY: ['#F472B6', '#C084FC', '#818CF8'], // from-pink-300 via-purple-300 to-indigo-400
  SKY: ['#0EA5E9', '#0284C7'], // from-sky-400 to-sky-500
  SUNSET: ['#F87171', '#FB923C', '#F87171'], // from-red-400 via-orange-400 to-red-400
  DRUMSTICK: ['#EAB308', '#EC4899'], // from-yellow-400 to-pink-500
  RAINBOW: ['#F59E0B', '#10B981', '#EC4899'], // from-yellow-500 via-green-400 to-pink-500
  RAINBOW_V2: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0066FF'], // bright rainbow with 5 colors (red, orange, yellow, green, blue)
  DEFAULT: null,
};

const ColorPresets: React.FC<ColorPresetsProps> = ({
  setUserColor,
  setGradientColors,
  setUsername,
  lightModeContrast,
  darkModeContrast,
  isLightModeWCAGCompliant,
  isDarkModeWCAGCompliant,
}) => {
  const resetToDefaults = () => {
    const defaultTheme = ['#646cff', '#646cff'];
    setUserColor(defaultTheme[0]);
    setGradientColors(defaultTheme);
    setUsername('GradientUser123');
  };

  return (
    <div className="mt-4 p-5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-dual-dark">Try preset colors:</div>
        <div className="flex gap-1">
          <button className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-dual-darkest rounded hover:opacity-90" onClick={resetToDefaults}>
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Object.entries(displayNameThemes)
          .filter(([_, colors]) => colors !== null)
          .map(([name, colors]) => {
            const mainColor = colors ? colors[0] : '#646cff';
            return (
              <button
                key={name}
                onClick={() => {
                  if (colors) {
                    setUserColor(colors[0]);
                    setGradientColors([...colors]);
                  }
                }}
                className="flex flex-col items-center gap-1"
                title={name.replace(/_/g, ' ')}
              >
                <div className="w-12 h-9 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
                  {colors && colors.length > 1 ? (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to right, ${colors.join(', ')})`,
                      }}
                    ></div>
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: mainColor }}></div>
                  )}
                </div>
                <span className="text-[10px] text-dual-dark">{name.replace(/_/g, ' ').toLowerCase()}</span>
              </button>
            );
          })}
      </div>

      <div className="text-xs text-center text-dual-dark">
        <span className="mx-1">
          <span className={`inline-block w-2 h-2 rounded-full ${isLightModeWCAGCompliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="ml-1">Light: {lightModeContrast.toFixed(1)}</span>
        </span>
        <span className="mx-1">
          <span className={`inline-block w-2 h-2 rounded-full ${isDarkModeWCAGCompliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="ml-1">Dark: {darkModeContrast.toFixed(1)}</span>
        </span>
        <span className="text-[10px] ml-1">(WCAG ≥ 4.5)</span>
      </div>
    </div>
  );
};

export default ColorPresets;
