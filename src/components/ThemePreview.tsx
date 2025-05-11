import React from 'react';
import ContainerWithHeader from './ContainerWithHeader';
import { getAdaptedColor, adaptGradientColors, getTextColor } from '../utils/colorUtils';
import clsx from 'clsx';

type ThemeMode = 'light' | 'dark';

interface ThemePreviewProps {
  username: string;
  selectedColor: string;
  gradientColors: string[];
  mode: ThemeMode;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  username,
  selectedColor,
  gradientColors,
  mode,
}) => {
  // Determine if we're in dark mode
  const isDarkMode = mode === 'dark';

  // Calculate adapted colors based on the selected color
  const darkModeColor = getAdaptedColor(selectedColor, true);
  const lightModeColor = getAdaptedColor(selectedColor, false);

  // Get the color for this preview based on mode
  const previewColor = isDarkMode ? darkModeColor : lightModeColor;

  // Calculate text color for contrast
  const previewTextColor = getTextColor(previewColor);

  // Calculate adapted gradient colors for both modes
  const darkModeGradientColors = adaptGradientColors(gradientColors, true);
  const lightModeGradientColors = adaptGradientColors(gradientColors, false);

  // Use the current mode's gradient colors for the username
  const usernameColors = isDarkMode ? darkModeGradientColors : lightModeGradientColors;

  // Use the opposing mode's gradient colors for the header (for contrast)
  const headerColors = isDarkMode ? lightModeGradientColors : darkModeGradientColors;

  // We use the dark class for the dark mode preview
  // For light mode preview in a dark mode context, we use the light variant
  return (
    <div className={clsx('flex-1 min-w-[280px] max-w-[400px]', isDarkMode ? 'dark' : 'light')}>
      <div
        className="p-5 rounded-lg shadow-md border transition-all duration-300 
                      light:bg-white light:text-zinc-800 light:border-zinc-200
                      dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
      >
        <h3 className="mt-0 mb-5 text-xl">{isDarkMode ? 'Dark' : 'Light'} Mode Preview</h3>
        <div className="flex flex-col gap-4 items-center p-4 rounded">
          <div className="mb-5 p-4 rounded-md light:bg-black/5 dark:bg-white/5">
            <span
              className="text-3xl font-bold py-1 px-3 rounded tracking-wide inline-block"
              style={
                gradientColors.length > 1
                  ? {
                      backgroundImage: `linear-gradient(to right, ${usernameColors.join(', ')})`,
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
                <ContainerWithHeader
                  gradientColors={headerColors}
                  isDarkMode={isDarkMode}
                  title="Gradient Header Preview"
                >
                  <p>Text content with your chosen color scheme</p>
                </ContainerWithHeader>
              </div>
            </div>
          </div>

          <div
            className="w-full h-10 rounded mb-1.5 border border-black/10"
            style={{ backgroundColor: previewColor }}
          ></div>
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
};

export default ThemePreview;
