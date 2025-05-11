import { useState, useRef, useEffect } from 'react';

interface GradientBuilderScrollProps {
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  setUserColor: (color: string) => void;
}

type MouseMoveHandler = (e: MouseEvent) => void;

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

function GradientBuilderScroll({ gradientColors, setGradientColors, setUserColor }: GradientBuilderScrollProps) {
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Handle clicking on a color pill
  const handleColorClick = (index: number) => {
    setActiveColorIndex(index);
    setShowColorPicker(true);
  };

  // Handle adding a new color
  const handleAddColor = () => {
    if (gradientColors.length < 6) {
      // Use the last color as default for new color
      const newColor = gradientColors[gradientColors.length - 1];
      setGradientColors([...gradientColors, newColor]);
      setActiveColorIndex(gradientColors.length);
      setShowColorPicker(true);
    }
  };

  // Handle removing the last color
  const handleRemoveLastColor = () => {
    if (gradientColors.length > 1) {
      const newColors = [...gradientColors];
      newColors.pop(); // Remove the last color
      setGradientColors(newColors);
      setActiveColorIndex(null);
      setShowColorPicker(false);
    }
  };

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeColorIndex !== null) {
      const newColors = [...gradientColors];
      newColors[activeColorIndex] = e.target.value;
      setGradientColors(newColors);
    }
  };

  // Trigger color picker when activeColorIndex changes
  useEffect(() => {
    if (showColorPicker && colorPickerRef.current && activeColorIndex !== null) {
      colorPickerRef.current.click();
    }
  }, [showColorPicker, activeColorIndex]);

  // Create the gradient background for preview
  const gradientBackground = gradientColors.length > 1 ? `linear-gradient(to right, ${gradientColors.join(', ')})` : gradientColors[0];

  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg my-4 border border-zinc-200 dark:border-zinc-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dual-darkest">Select a colour</h3>
        <div className="text-xs text-dual-dark">{gradientColors.length}/6 colors</div>
      </div>

      {/* Preset colors section */}
      <div className="mb-6 relative">
        {/* Shadow indicators for scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-zinc-800 dark:to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-zinc-800 dark:to-transparent z-10 pointer-events-none"></div>

        {/* Navigation buttons */}
        <button
          onClick={() => {
            const container = document.getElementById('gradient-scroll-container');
            if (container) {
              container.scrollBy({ left: -200, behavior: 'smooth' });
            }
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-zinc-800/80 rounded-full p-1 shadow-md hover:bg-white dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dual-darkest" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <button
          onClick={() => {
            const container = document.getElementById('gradient-scroll-container');
            if (container) {
              container.scrollBy({ left: 200, behavior: 'smooth' });
            }
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-zinc-800/80 rounded-full p-1 shadow-md hover:bg-white dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dual-darkest" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          id="gradient-scroll-container"
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={(e) => {
            // Skip if clicked on a button
            if ((e.target as Element).closest('button')) return;

            const slider = e.currentTarget;
            let startX = e.pageX - slider.offsetLeft;
            let scrollLeft = slider.scrollLeft;

            const handleMouseMove: MouseMoveHandler = (e) => {
              const x = e.pageX - slider.offsetLeft;
              const walk = x - startX;
              slider.scrollLeft = scrollLeft - walk;
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div className="flex gap-3 px-4 mx-auto">
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
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                  title={name.replace(/_/g, ' ')}
                >
                  <div className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
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
      </div>

      {/* Hidden color picker */}
      <input
        ref={colorPickerRef}
        type="color"
        value={activeColorIndex !== null ? gradientColors[activeColorIndex] : '#ffffff'}
        onChange={handleColorChange}
        onBlur={() => setShowColorPicker(false)}
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
          {gradientColors.length < 6 && (
            <button
              onClick={handleAddColor}
              className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-dual-dark hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              title="Add color"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GradientBuilderScroll;
