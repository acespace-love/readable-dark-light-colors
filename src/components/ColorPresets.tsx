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

const PRESET_COLORS = [
  { color: '#ffffff', name: 'White' },
  { color: '#000000', name: 'Black' },
  { color: '#ff0000', name: 'Red' },
  { color: '#00ff00', name: 'Green' },
  { color: '#0000ff', name: 'Blue' },
  { color: '#ff00ff', name: 'Pink' },
  { color: '#ffff00', name: 'Yellow' },
];

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
    setUserColor('#646cff');
    setGradientColors(['#646cff']);
    setUsername('GradientUser123');
  };

  return (
    <div className="mt-4 p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-[var(--text-secondary)]">Try preset colors:</div>
        <div className="flex gap-1">
          <button
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-[var(--text-primary)] rounded hover:opacity-90"
            onClick={resetToDefaults}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1 mb-2">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.color}
            onClick={() => setUserColor(preset.color)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm"
            title={preset.name}
          >
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.color }}></div>
          </button>
        ))}
      </div>

      <div className="text-xs text-center text-[var(--text-secondary)]">
        <span className="mx-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${isLightModeWCAGCompliant ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          <span className="ml-1">Light: {lightModeContrast.toFixed(1)}</span>
        </span>
        <span className="mx-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${isDarkModeWCAGCompliant ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          <span className="ml-1">Dark: {darkModeContrast.toFixed(1)}</span>
        </span>
        <span className="text-[10px] ml-1">(WCAG ≥ 4.5)</span>
      </div>
    </div>
  );
};

export default ColorPresets;
