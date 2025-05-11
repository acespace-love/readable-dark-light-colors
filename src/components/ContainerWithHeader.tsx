import React from 'react';

interface ContainerWithHeaderProps {
  gradientColors: string[];
  isDarkMode: boolean;
  title?: string;
  children?: React.ReactNode;
}

const ContainerWithHeader: React.FC<ContainerWithHeaderProps> = ({ 
  gradientColors, 
  isDarkMode, 
  title = "Container Title",
  children
}) => {
  // Set text color based on the theme mode
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

export default ContainerWithHeader;