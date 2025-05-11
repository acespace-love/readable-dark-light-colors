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

const LightModePreview: React.FC<PreviewProps> = ({
  username,
  gradientColors,
  adaptedLightModeColors,
  adaptedDarkModeColors,
  lightModeColor,
  lightModeTextColor,
}) => {
  // Force light mode styles regardless of app theme
  const isDarkMode = false;

  return (
    <div className="flex-1 min-w-[280px] max-w-[400px] p-5 rounded-lg shadow-md bg-white text-[#213547] border border-[#e2e8f0] transition-all duration-300">
      <h3 className="mt-0 mb-5 text-xl">Light Mode Preview</h3>
      <div className="flex flex-col gap-4 items-center p-4 rounded">
        <div className="mb-5 p-4 rounded-md bg-black/[0.03]">
          <span
            className="text-3xl font-bold py-1 px-3 rounded tracking-wide inline-block"
            style={
              gradientColors.length > 1
                ? {
                    backgroundImage: `linear-gradient(to right, ${adaptedLightModeColors.join(', ')})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : { color: adaptedLightModeColors[0] }
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
                gradientColors={adaptedDarkModeColors} /* Use dark mode colors in light mode */
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
          style={{ backgroundColor: lightModeColor }}
        ></div>
        <p style={{ color: lightModeColor }}>Text in your selected color</p>
        <button
          className="border-none py-2 px-4 rounded font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90"
          style={{ backgroundColor: lightModeColor, color: lightModeTextColor }}
        >
          Button with your color
        </button>
      </div>
    </div>
  );
};

export default LightModePreview;
