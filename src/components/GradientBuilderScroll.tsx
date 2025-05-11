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
        <h3 className="text-lg font-semibold text-dual-darkest">Select a colour</h3>
        <div className="text-xs text-dual-dark">{gradientColors.length}/6 colors</div>
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