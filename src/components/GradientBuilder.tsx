import { useState, useRef, useEffect } from 'react';

interface GradientBuilderProps {
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
}

function GradientBuilder({ gradientColors, setGradientColors }: GradientBuilderProps) {
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

  // Handle removing a color
  const handleRemoveColor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the pill click event
    if (gradientColors.length > 1) {
      setGradientColors(gradientColors.filter((_, i) => i !== index));
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
        <h3 className="text-lg font-semibold text-dual-darkest">Gradient Builder</h3>
        <div className="text-xs text-dual-dark">{gradientColors.length}/6 colors</div>
      </div>

      {/* Color preview */}
      <div className="h-12 w-full rounded-md mb-4 border border-zinc-200 dark:border-zinc-600" style={{ background: gradientBackground }}></div>

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
      <div className="flex flex-wrap gap-2 items-center">
        {gradientColors.map((color, index) => (
          <div
            key={index}
            onClick={() => handleColorClick(index)}
            className="h-8 pl-6 pr-2 rounded-full flex items-center gap-2 cursor-pointer border border-zinc-200 dark:border-zinc-600 hover:shadow-md transition-shadow duration-200 group"
            style={{ background: color }}
          >
            {gradientColors.length > 1 && (
              <button
                className="w-5 h-5 rounded-full bg-white/80 text-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemoveColor(index, e)}
                title="Remove color"
              >
                ×
              </button>
            )}
          </div>
        ))}

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
  );
}

// Helper function to determine if text should be black or white based on background color
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default GradientBuilder;
