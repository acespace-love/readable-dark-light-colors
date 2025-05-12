import { getTextColor, getContrastRatio, isWCAGCompliant, getAdaptedColor, adaptGradientColors, createGradientString } from '../../../src/utils.js';

interface GradientControlsProps {
  userColor: string;
  setUserColor: (value: string) => void;
  gradientColors: string[];
  setGradientColors: (value: string[]) => void;
  mode: 'light' | 'dark';
}

function GradientControls({ userColor, setUserColor, gradientColors, setGradientColors, mode }: GradientControlsProps) {
  // Calculate adapted colors for both modes
  const darkModeColor = getAdaptedColor(userColor, 'dark');
  const lightModeColor = getAdaptedColor(userColor, 'light');

  // Adapted gradient colors for both modes
  const adaptedGradientColors = adaptGradientColors(gradientColors, mode);

  // Remove color from gradient
  const removeColorFromGradient = (indexToRemove: number) => {
    if (gradientColors.length > 1) {
      const newColors = gradientColors.filter((_, index) => index !== indexToRemove);
      setGradientColors(newColors);
      // Update userColor to be the last color in the palette
      setUserColor(newColors[newColors.length - 1]);
    }
  };

  // Update a specific color in the gradient
  const updateGradientColor = (index: number, newColor: string) => {
    const newColors = [...gradientColors];
    newColors[index] = newColor;
    setGradientColors(newColors);
    // Set the current color to the one that was just updated
    setUserColor(newColor);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg my-4 border border-zinc-200 dark:border-zinc-700 shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-dual-darkest">Current Color Preview</h3>

      {/* Light and Dark mode color variants */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
        <div className="flex flex-col gap-1.5 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-dual-dark">Selected Color</span>
            <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: userColor }}></div>
          </div>
          <code className="font-mono text-xs bg-white/80 dark:bg-black/30 px-1.5 py-0.5 rounded text-dual-darkest">{userColor}</code>
        </div>

        <div className="border-l border-zinc-300 dark:border-zinc-600 h-12 mx-2"></div>

        <div className="flex flex-col gap-1.5 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-dual-dark">Light Mode</span>
            <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: lightModeColor }}></div>
          </div>
          <code className="font-mono text-xs bg-white/80 dark:bg-black/30 px-1.5 py-0.5 rounded text-dual-darkest">{lightModeColor}</code>
          <div className="flex items-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${isWCAGCompliant(lightModeColor, getTextColor(lightModeColor)) ? 'bg-green-500' : 'bg-red-500'}`}
              title={`Contrast: ${getContrastRatio(lightModeColor, getTextColor(lightModeColor)).toFixed(1)}`}
            ></span>
            <span className="text-[10px] text-dual-dark" title="Contrast ratio">
              {getContrastRatio(lightModeColor, getTextColor(lightModeColor)).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="border-l border-zinc-300 dark:border-zinc-600 h-12 mx-2"></div>

        <div className="flex flex-col gap-1.5 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-dual-dark">Dark Mode</span>
            <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: darkModeColor }}></div>
          </div>
          <code className="font-mono text-xs bg-white/80 dark:bg-black/30 px-1.5 py-0.5 rounded text-dual-darkest">{darkModeColor}</code>
          <div className="flex items-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${isWCAGCompliant(darkModeColor, getTextColor(darkModeColor)) ? 'bg-green-500' : 'bg-red-500'}`}
              title={`Contrast: ${getContrastRatio(darkModeColor, getTextColor(darkModeColor)).toFixed(1)}`}
            ></span>
            <span className="text-[10px] text-dual-dark" title="Contrast ratio">
              {getContrastRatio(darkModeColor, getTextColor(darkModeColor)).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 my-4">
        {gradientColors.map((color, index) => {
          const isWcagCompliant = isWCAGCompliant(color, getTextColor(color));
          const lightModeVariant = getAdaptedColor(color, 'light');
          const darkModeVariant = getAdaptedColor(color, 'dark');

          return (
            <div key={index} className="flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.03] p-2 rounded relative text-xs">
              <div className="flex flex-col items-center gap-0.5 mr-1">
                <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: color }}></div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateGradientColor(index, e.target.value)}
                  className="w-[20px] h-[20px] border-none bg-transparent cursor-pointer p-0"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-0.5">
                  <code className="font-mono text-xs text-dual-darkest">{color}</code>
                  <span className={`inline-block w-2 h-2 rounded-full ${isWcagCompliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: lightModeVariant }}></div>
                    <span className="text-dual-dark text-[9px]">L</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: darkModeVariant }}></div>
                    <span className="text-dual-dark text-[9px]">D</span>
                  </div>
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
        <div className="h-10 rounded w-full" style={{ background: createGradientString(adaptedGradientColors) }} />

        {/* Small WCAG explainer */}
        <div className="text-[10px] text-center text-dual-dark mt-1">
          <span title="Web Content Accessibility Guidelines">WCAG AA</span>:<span className="ml-1 text-green-500">●</span> Pass
          <span className="ml-1 text-red-500">●</span> Fail
          <span className="ml-1">(contrast ratio ≥ 4.5:1)</span>
        </div>
      </div>
    </div>
  );
}

export default GradientControls;
