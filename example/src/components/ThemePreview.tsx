import ContainerWithHeader from './ContainerWithHeader';
import {
  getAdaptedColor,
  adaptGradientColors,
  getTextColor,
  createGradientString,
  lightenColors
} from '../../../src/utils.js';
import clsx from 'clsx';

import { type Theme } from '../../../src/constants.js';

interface ThemePreviewProps {
  username: string;
  selectedColor: string;
  gradientColors: string[];
  mode: Exclude<Theme, 'both'>;
}

function ThemePreview({ username, selectedColor, gradientColors, mode }: ThemePreviewProps) {
  // Get adapted colors directly for the current theme mode
  const previewColor = getAdaptedColor(selectedColor, mode);
  const previewTextColor = getTextColor(previewColor);

  // Get adapted gradient colors for the current theme
  const usernameColors = adaptGradientColors(gradientColors, mode);
  // Use opposing mode gradient colors for the header (for contrast)
  const headerColors = adaptGradientColors(gradientColors, "both");
  const headerTextColors = adaptGradientColors(gradientColors, mode);

  // Determine if we're in dark mode
  const isDarkMode = mode === 'dark';


  // We use the dark class for the dark mode preview
  // For light mode preview in a dark mode context, we use the light variant
  return (
    <div className={clsx('flex-1 min-w-[280px] max-w-[400px]', isDarkMode ? 'dark' : 'light')}>
      <div className="p-5 rounded-lg shadow-md border light:bg-white light:text-zinc-800 light:border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700">
        <h3 className="mt-0 mb-5 text-xl">{isDarkMode ? 'Dark' : 'Light'} Mode Preview</h3>
        <div className="flex flex-col gap-4 items-center p-4 rounded">
          <div className="mb-5 p-4 rounded-md light:bg-black/5 dark:bg-white/5">
            <span
              className="text-3xl font-bold py-1 px-3 rounded tracking-wide inline-block"
              style={
                gradientColors.length > 1
                  ? {
                      backgroundImage: createGradientString(usernameColors),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }
                  : { color: usernameColors[0] }
              }
            >
              {username}
            </span>
          </div>

          <div className="w-full my-5">
            <h4 className="mb-2.5 text-base font-medium">Container with Gradient Header:</h4>
            <div className="flex flex-col gap-5">
              <div className="flex-1">
                <ContainerWithHeader backgroundColor={createGradientString(lightenColors(headerColors, 0.15))} textColor={"black"}/>
              </div>
            </div>
          </div>

          <div className="w-full my-5">
            <h4 className="mb-2.5 text-base font-medium">Container with Gradient Text:</h4>
            <div className="flex flex-col gap-5">
              <div className="flex-1">
                <ContainerWithHeader backgroundColor={mode === "dark" ? "oklch(27.4% 0.006 286.033)" : "oklch(92% 0.004 286.32)"} textColor={createGradientString(headerTextColors)} isTextGradient/>
              </div>
            </div>
          </div>

          <div className="w-full h-10 rounded mb-1.5 border border-black/10" style={{ backgroundColor: previewColor }}></div>
          <p style={{ color: previewColor }}>Text in your selected color</p>
          <button
            className="border-none py-2 px-4 rounded font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90"
            style={{ backgroundColor: previewColor, color: previewTextColor }}
          >
            Button with your color
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemePreview;
