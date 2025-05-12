import { DEFAULT_THEMES } from '../constants/themes';
import { createGradientString } from '../utils/colorUtils';

interface ColorPresetsProps {
  setUserColor: (color: string) => void;
  setGradientColors: (colors: string[]) => void;
}

function ColorPresets({ setUserColor, setGradientColors }: ColorPresetsProps) {
  // Add event handler type declaration for TypeScript
  type MouseMoveHandler = (e: MouseEvent) => void;
  const resetToDefaults = () => {
    const defaultTheme = DEFAULT_THEMES.DEFAULT;
    setUserColor(defaultTheme[0]);
    setGradientColors(defaultTheme);
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

      <div className="mb-4 relative">
        {/* Shadow indicators for scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-zinc-800 dark:to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-zinc-800 dark:to-transparent z-10 pointer-events-none"></div>

        {/* Navigation buttons */}
        <button
          onClick={() => {
            const container = document.getElementById('preset-scroll-container');
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
            const container = document.getElementById('preset-scroll-container');
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
          id="preset-scroll-container"
          className="flex overflow-x-auto pb-3 px-6 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={(e) => {
            // Skip if clicked on a button
            if ((e.target as Element).closest('button')) return;

            const slider = e.currentTarget;
            const startX = e.pageX - slider.offsetLeft;
            const scrollLeft = slider.scrollLeft;

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
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                  title={name.replace(/_/g, ' ')}
                >
                  <div className="w-14 h-10 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
                    <div
                      className="w-full h-full"
                      style={{
                        background: createGradientString(colors),
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-dual-dark whitespace-nowrap">{name.replace(/_/g, ' ').toLowerCase()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPresets;
