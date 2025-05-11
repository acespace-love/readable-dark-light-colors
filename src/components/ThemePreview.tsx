import React from 'react';
import ContainerWithHeader from './ContainerWithHeader';

type ThemeMode = 'light' | 'dark';

interface ThemePreviewProps {
  username: string;
  gradientColors: string[];
  adaptedLightModeColors: string[];
  adaptedDarkModeColors: string[];
  lightModeColor: string;
  darkModeColor: string;
  lightModeTextColor: string;
  darkModeTextColor: string;
  mode: ThemeMode;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  username,
  gradientColors,
  adaptedLightModeColors,
  adaptedDarkModeColors,
  lightModeColor,
  darkModeColor,
  lightModeTextColor,
  darkModeTextColor,
  mode
}) => {
  // Determine if we're in dark mode
  const isDarkMode = mode === 'dark';
  
  // Select the appropriate colors based on the mode
  const previewColor = isDarkMode ? darkModeColor : lightModeColor;
  const previewTextColor = isDarkMode ? darkModeTextColor : lightModeTextColor;
  
  // Use opposing colors for contrast in the header
  const headerColors = isDarkMode ? adaptedLightModeColors : adaptedDarkModeColors;
  
  // Determine gradients for username display
  const usernameColors = isDarkMode ? adaptedDarkModeColors : adaptedLightModeColors;
  
  // Set background and text colors based on mode
  const bgColor = isDarkMode ? '#242424' : '#ffffff';
  const textColor = isDarkMode ? 'rgba(255,255,255,0.87)' : '#213547';
  const borderColor = isDarkMode ? '#4a5568' : '#e2e8f0';
  const bgShade = isDarkMode ? 'white/[0.03]' : 'black/[0.03]';
  
  return (
    <div className={`flex-1 min-w-[280px] max-w-[400px] p-5 rounded-lg shadow-md border transition-all duration-300`}
         style={{
           backgroundColor: bgColor,
           color: textColor,
           borderColor: borderColor
         }}>
      <h3 className="mt-0 mb-5 text-xl">{isDarkMode ? 'Dark' : 'Light'} Mode Preview</h3>
      <div className="flex flex-col gap-4 items-center p-4 rounded">
        <div className={`mb-5 p-4 rounded-md bg-${bgShade}`}>
          <span
            className="text-3xl font-bold py-1 px-3 rounded tracking-wide inline-block"
            style={
              gradientColors.length > 1
              ? {
                  backgroundImage: `linear-gradient(to right, ${usernameColors.join(', ')})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
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
  );
};

export default ThemePreview;