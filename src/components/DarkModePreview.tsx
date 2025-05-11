import React from 'react';
import ContainerWithHeader from './ContainerWithHeader';

interface PreviewProps {
  username: string;
  gradientColors: string[];
  adaptedLightModeColors: string[];
  adaptedDarkModeColors: string[];
  lightModeColor: string;
  darkModeColor: string;
  lightModeTextColor: string;
  darkModeTextColor: string;
}

const DarkModePreview: React.FC<PreviewProps> = ({
  username,
  gradientColors,
  adaptedLightModeColors,
  adaptedDarkModeColors,
  darkModeColor,
  darkModeTextColor,
}) => {
  // Force dark mode styles regardless of app theme
  const isDarkMode = true;

  return (
    <div className="flex-1 min-w-[280px] max-w-[400px] p-5 rounded-lg shadow-md bg-[#242424] text-[rgba(255,255,255,0.87)] border border-[#4a5568] transition-all duration-300">
      <h3 className="mt-0 mb-5 text-xl">Dark Mode Preview</h3>
      <div className="flex flex-col gap-4 items-center p-4 rounded">
        <div className="mb-5 p-4 rounded-md bg-white/[0.03]">
          <span
            className="text-3xl font-bold py-1 px-3 rounded tracking-wide inline-block"
            style={
              gradientColors.length > 1
                ? {
                    backgroundImage: `linear-gradient(to right, ${adaptedDarkModeColors.join(', ')})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : { color: adaptedDarkModeColors[0] }
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
                gradientColors={adaptedLightModeColors} /* Use light mode colors in dark mode */
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
          style={{ backgroundColor: darkModeColor }}
        ></div>
        <p style={{ color: darkModeColor }}>Text in your selected color</p>
        <button
          className="border-none py-2 px-4 rounded font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90"
          style={{ backgroundColor: darkModeColor, color: darkModeTextColor }}
        >
          Button with your color
        </button>
      </div>
    </div>
  );
};

export default DarkModePreview;
