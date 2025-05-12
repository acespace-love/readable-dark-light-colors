import { useState, useRef } from 'react';

interface GradientBuilderWithPresetsProps {
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  setUserColor: (color: string) => void;
  maximumColorCount?: number;
}

// Preset color themes - matches the config in ColorPresets.tsx
export const displayNameThemes: Record<string, readonly string[]> = {
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

function GradientBuilderWithPresets({ gradientColors, setGradientColors, setUserColor, maximumColorCount = 1 }: GradientBuilderWithPresetsProps) {
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  // Track if this was a new color added
  const newColorAddedRef = useRef<boolean>(false);

  // Handle clicking on a color pill
  const handleColorClick = (index: number) => {
    setActiveColorIndex(index);
    newColorAddedRef.current = false; // Editing existing color
    showColourPicker();
  };

  // Handle adding a new color
  const handleAddColor = () => {
    if (gradientColors.length < 6) {
      // Use the last color as default for new color
      const newColor = gradientColors[gradientColors.length - 1];
      setGradientColors([...gradientColors, newColor]);
      setActiveColorIndex(gradientColors.length);
      newColorAddedRef.current = true; // Mark as a newly added color
    }
  };

  // Handle removing the last color
  const handleRemoveLastColor = () => {
    if (gradientColors.length > 1) {
      const newColors = [...gradientColors];
      newColors.pop(); // Remove the last color
      setGradientColors(newColors);
      setActiveColorIndex(null);
      newColorAddedRef.current = false;
    }
  };

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeColorIndex !== null) {
      const newColors = [...gradientColors];
      newColors[activeColorIndex] = e.target.value;
      setGradientColors(newColors);

      // Once the color has been changed, it's no longer considered "new"
      if (newColorAddedRef.current) {
        newColorAddedRef.current = false;
      }
    }
  };

  function showColourPicker() {
    if (colorPickerRef.current) colorPickerRef.current.click();
  }

  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg my-4 border border-zinc-200 dark:border-zinc-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dual-darkest">Select a colour</h3>
        <div className="text-xs text-dual-dark">
          {gradientColors.length}/{maximumColorCount} colors
        </div>
      </div>

      {/* Preset colors section */}
      <div className="mb-6">
        {/* Color grid with flex-wrap */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(displayNameThemes).map(([name, colors]) => {
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
                className="flex flex-col items-center"
                title={name.replace(/_/g, ' ')}
              >
                <div className="w-7 h-7 rounded-md overflow-hidden shadow-sm">
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden color picker */}
      <input
        ref={colorPickerRef}
        type="color"
        value={activeColorIndex !== null ? gradientColors[activeColorIndex] : '#ffffff'}
        onChange={handleColorChange}
        className="sr-only"
      />

      {/* Color pills list */}
      <div className="flex flex-wrap items-center">
        <div className="flex flex-wrap gap-2 flex-grow mb-2">
          {gradientColors.map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorClick(index)}
              className="h-8 w-8 rounded-xl flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow duration-200"
              style={{ background: color }}
            ></div>
          ))}
        </div>

        {/* Control buttons */}
        <div className="flex gap-2 ml-2">
          {/* Remove button */}
          <button
            onClick={handleRemoveLastColor}
            className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-dual-dark hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Remove last color"
            disabled={gradientColors.length <= 1}
          >
            −
          </button>

          {/* Add button */}

          <button
            onClick={handleAddColor}
            className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-dual-dark hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors  disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add color"
            disabled={gradientColors.length >= maximumColorCount}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default GradientBuilderWithPresets;
