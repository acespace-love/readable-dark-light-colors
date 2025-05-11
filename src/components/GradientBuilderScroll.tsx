import { useState, useRef, useEffect } from 'react';

interface GradientBuilderScrollProps {
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
}

type MouseMoveHandler = (e: MouseEvent) => void;

function GradientBuilderScroll({ gradientColors, setGradientColors }: GradientBuilderScrollProps) {
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
  const gradientBackground = gradientColors.length > 1 
    ? `linear-gradient(to right, ${gradientColors.join(', ')})` 
    : gradientColors[0];

  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg my-4 border border-zinc-200 dark:border-zinc-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dual-darkest">Gradient Builder</h3>
        <div className="text-xs text-dual-dark">{gradientColors.length}/6 colors</div>
      </div>

      {/* Color preview */}
      <div 
        className="h-12 w-full rounded-md mb-4 border border-zinc-200 dark:border-zinc-600"
        style={{ background: gradientBackground }}
      ></div>

      {/* Hidden color picker */}
      <input
        ref={colorPickerRef}
        type="color"
        value={activeColorIndex !== null ? gradientColors[activeColorIndex] : '#ffffff'}
        onChange={handleColorChange}
        onBlur={() => setShowColorPicker(false)}
        className="sr-only"
      />

      {/* Scrollable color selector with navigation controls */}
      <div className="mb-4 relative">
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
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          id="gradient-scroll-container"
          className="flex overflow-x-auto pb-3 px-6 scrollbar-hide cursor-grab active:cursor-grabbing"
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
          <div className="flex gap-3 px-4">
            {/* Color squares for editing the gradient */}
            {gradientColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(index)}
                className={`w-14 h-14 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${
                  activeColorIndex === index ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-800' : ''
                }`}
                title={`Edit color: ${color}`}
              >
                <div className="w-full h-full" style={{ backgroundColor: color }}></div>
              </button>
            ))}
            
            {/* Control buttons */}
            <div className="flex flex-col gap-2 justify-center">
              {/* Remove button */}
              <button
                onClick={handleRemoveLastColor}
                className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-dual-dark hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                title="Remove last color"
                disabled={gradientColors.length <= 1}
              >
                −
              </button>

              {/* Add button */}
              {gradientColors.length < 6 && (
                <button
                  onClick={handleAddColor}
                  className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-dual-dark hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors shadow-sm"
                  title="Add color"
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradientBuilderScroll;