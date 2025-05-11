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
    <div className={`demo-container ${isDarkMode ? 'dark-container' : 'light-container'}`}>
      <div
        className="demo-container-header"
        style={{
          background: headerBackground,
          color: textColor
        }}
      >
        {title}
      </div>
      <div 
        className="demo-container-content"
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
    <div className="preview-box light-preview">
      <h3>Light Mode Preview</h3>
      <div className="content-preview">
        <div className="username-preview">
          <span
            className="gradient-username"
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

        <div className="preview-section">
          <h4>Container with Gradient Header:</h4>
          <div className="header-examples">
            <div className="header-option">
              <p className="option-label">Option 1: Swapped Colors</p>
              <ContainerWithHeader
                gradientColors={adaptedDarkModeColors} /* Use dark mode colors in light mode */
                isDarkMode={isDarkMode}
                title="Light Mode Header"
              >
                <p>Using dark mode colors in light mode with black text</p>
              </ContainerWithHeader>
            </div>

            <div className="header-option">
              <p className="option-label">Option 2: Matching Colors</p>
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

        <div className="color-swatch" style={{ backgroundColor: lightModeColor }}></div>
        <p style={{ color: lightModeColor }}>Text in your selected color</p>
        <button 
          className="content-preview button"
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
    <div className="preview-box dark-preview">
      <h3>Dark Mode Preview</h3>
      <div className="content-preview">
        <div className="username-preview">
          <span
            className="gradient-username"
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

        <div className="preview-section">
          <h4>Container with Gradient Header:</h4>
          <div className="header-examples">
            <div className="header-option">
              <p className="option-label">Option 1: Swapped Colors</p>
              <ContainerWithHeader
                gradientColors={adaptedLightModeColors} /* Use light mode colors in dark mode */
                isDarkMode={isDarkMode}
                title="Dark Mode Header"
              >
                <p>Using light mode colors in dark mode with white text</p>
              </ContainerWithHeader>
            </div>

            <div className="header-option">
              <p className="option-label">Option 2: Matching Colors</p>
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

        <div className="color-swatch" style={{ backgroundColor: darkModeColor }}></div>
        <p style={{ color: darkModeColor }}>Text in your selected color</p>
        <button 
          className="content-preview button"
          style={{ backgroundColor: darkModeColor, color: darkModeTextColor }}
        >
          Button with your color
        </button>
      </div>
    </div>
  );
};