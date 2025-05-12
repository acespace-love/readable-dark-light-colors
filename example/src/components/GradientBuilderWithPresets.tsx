import { useState, useRef } from 'react';
import { DEFAULT_THEMES } from '../../../src/constants.js';
import { createGradientString, getAdaptedColor } from '../../../src/utils.js';

interface GradientBuilderWithPresetsProps {
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  setUserColor: (color: string) => void;
  maximumColorCount?: number;
}

function GradientBuilderWithPresets({ gradientColors, setGradientColors, setUserColor, maximumColorCount = 1 }: GradientBuilderWithPresetsProps) {
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [showColorDetails, setShowColorDetails] = useState<number | null>(null);
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

  // Toggle showing color details
  const toggleColorDetails = (index: number) => {
    if (showColorDetails === index) {
      setShowColorDetails(null);
    } else {
      setShowColorDetails(index);
    }
  };

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
          {Object.entries(DEFAULT_THEMES).map(([name, colors]) => {
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
                <div className="w-7 h-7 rounded-md border-2 border-zinc-700 dark:border-zinc-600 overflow-hidden shadow-sm">
                  <div className="w-full h-full" style={{ background: createGradientString(colors) }}></div>
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
      <div className="flex flex-wrap items-center gap-4 ">
        <h4 className={'text-dual-dark font-bold'}>Palette:</h4>
        <div className="flex flex-wrap gap-2 flex-grow">
          {gradientColors.map((color, index) => (
            <div key={index} className="relative">
              <div
                onClick={() => handleColorClick(index)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleColorDetails(index);
                }}
                className="h-6 w-6 border border-zinc-700 dark:border-zinc-600 rounded-xl flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow duration-200"
                style={{ background: color }}
                title="Click to edit color, right-click for color details"
              ></div>

              {/* Color details popup */}
              {showColorDetails === index && (
                <div className="absolute z-10 top-8 left-0 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-lg p-2 min-w-[200px]">
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="font-bold text-dual-darkest">Color Details</div>
                    <div className="flex items-center gap-1">
                      <span className="text-dual-dark">Original:</span>
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color }}></div>
                      <code className="font-mono text-[10px] bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded text-dual-darkest">{color}</code>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-dual-dark">Light mode:</span>
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: getAdaptedColor(color, 'light') }}></div>
                      <code className="font-mono text-[10px] bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded text-dual-darkest">{getAdaptedColor(color, 'light')}</code>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-dual-dark">Dark mode:</span>
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: getAdaptedColor(color, 'dark') }}></div>
                      <code className="font-mono text-[10px] bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded text-dual-darkest">{getAdaptedColor(color, 'dark')}</code>
                    </div>
                    <div className="text-[10px] mt-1 text-dual-dark">
                      Click outside or right-click again to close
                    </div>
                  </div>
                </div>
              )}
            </div>
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

      {/* Instructions */}
      <div className="mt-3 text-xs text-center text-dual-dark">
        Right-click on any color to view its dark/light mode adapted values
      </div>
    </div>
  );
}

export default GradientBuilderWithPresets;
