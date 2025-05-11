import React from 'react';

interface ContainerWithHeaderProps {
  gradientColors: string[];
  isDarkMode: boolean;
  title?: string;
  children?: React.ReactNode;
}

// Component to display a container with gradient header
export const ContainerWithHeader: React.FC<ContainerWithHeaderProps> = ({ 
  gradientColors, 
  isDarkMode, 
  title = "Container Title",
  children
}) => {
  // Set text color based on the theme mode
  // Light mode uses black text, dark mode uses white text
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  
  // Create gradient or solid background
  const headerBackground = gradientColors.length > 1
    ? `linear-gradient(to right, ${gradientColors.join(', ')})`
    : gradientColors[0];
    
  // Container styles that can't be easily done with CSS variables
  const containerContentStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    color: isDarkMode ? '#e0e0e0' : '#333333',
  };
    
  return (
    <div className={`w-full rounded-md overflow-hidden shadow-md ${isDarkMode ? 'shadow-black/40' : 'shadow-black/10'}`}>
      <div
        className="py-3 px-4 font-semibold text-base tracking-wide"
        style={{
          background: headerBackground,
          color: textColor
        }}
      >
        {title}
      </div>
      <div
        className="p-4 text-[15px] transition-colors duration-300"
        style={containerContentStyle}
      >
        {children || "Container content goes here"}
      </div>
    </div>
  );
};

interface GradientPreviewProps {
  username: string;
  gradientColors: string[];
  adaptedLightModeColors: string[];
  adaptedDarkModeColors: string[];
  lightModeColor: string;
  darkModeColor: string;
  lightModeTextColor: string;
  darkModeTextColor: string;
}

export const LightModePreview: React.FC<GradientPreviewProps> = ({
  username,
  gradientColors,
  adaptedLightModeColors,
  adaptedDarkModeColors,
  lightModeColor,
  lightModeTextColor
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
                  color: 'transparent'
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
              <p className="text-sm font-semibold mb-2 text-left text-[#4a5568]">Option 1: Swapped Colors</p>
              <ContainerWithHeader
                gradientColors={adaptedDarkModeColors} /* Use dark mode colors in light mode */
                isDarkMode={isDarkMode}
                title="Light Mode Header"
              >
                <p>Using dark mode colors in light mode with black text</p>
              </ContainerWithHeader>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold mb-2 text-left text-[#4a5568]">Option 2: Matching Colors</p>
              <ContainerWithHeader
                gradientColors={adaptedLightModeColors}
                isDarkMode={isDarkMode}
                title="Light Mode Header"
              >
                <p>Using light mode colors in light mode with black text</p>
              </ContainerWithHeader>
            </div>
          </div>
        </div>

        <div className="w-full h-10 rounded mb-1.5 border border-black/10" style={{ backgroundColor: lightModeColor }}></div>
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

export const DarkModePreview: React.FC<GradientPreviewProps> = ({
  username,
  gradientColors,
  adaptedLightModeColors,
  adaptedDarkModeColors,
  darkModeColor,
  darkModeTextColor
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
                  color: 'transparent'
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
              <p className="text-sm font-semibold mb-2 text-left text-[#a0aec0]">Option 1: Swapped Colors</p>
              <ContainerWithHeader
                gradientColors={adaptedLightModeColors} /* Use light mode colors in dark mode */
                isDarkMode={isDarkMode}
                title="Dark Mode Header"
              >
                <p>Using light mode colors in dark mode with white text</p>
              </ContainerWithHeader>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold mb-2 text-left text-[#a0aec0]">Option 2: Matching Colors</p>
              <ContainerWithHeader
                gradientColors={adaptedDarkModeColors}
                isDarkMode={isDarkMode}
                title="Dark Mode Header"
              >
                <p>Using dark mode colors in dark mode with white text</p>
              </ContainerWithHeader>
            </div>
          </div>
        </div>

        <div className="w-full h-10 rounded mb-1.5 border border-black/10" style={{ backgroundColor: darkModeColor }}></div>
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