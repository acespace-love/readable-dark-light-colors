import type { ReactNode } from 'react';

interface ContainerWithHeaderProps {
  gradientColors: string[];
  isDarkMode: boolean;
  title?: string;
  children?: ReactNode;
  theme?: 'dark' | 'light';
}

function ContainerWithHeader({ gradientColors, isDarkMode, title = 'Container Title', children, theme }: ContainerWithHeaderProps) {
  // Set text color based on the theme mode (use theme prop if provided, otherwise fall back to isDarkMode)
  const effectiveTheme = theme || (isDarkMode ? 'dark' : 'light');
  const textColor = effectiveTheme === 'dark' ? '#FFFFFF' : '#000000';

  // Create gradient or solid background
  const headerBackground = gradientColors.length > 1 ? `linear-gradient(to right, ${gradientColors.join(', ')})` : gradientColors[0];

  // Container styles that can't be easily done with CSS variables
  const containerContentStyle = {
    backgroundColor: effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: effectiveTheme === 'dark' ? '#e0e0e0' : '#333333',
  };

  return (
    <div className={`w-full rounded-md overflow-hidden shadow-md ${effectiveTheme === 'dark' ? 'shadow-black/40' : 'shadow-black/10'}`}>
      <div
        className="py-3 px-4 font-semibold text-base tracking-wide"
        style={{
          background: headerBackground,
          color: textColor,
        }}
      >
        {title}
      </div>
      <div className="p-4 text-[15px] transition-colors duration-300" style={containerContentStyle}>
        {children || 'Container content goes here'}
      </div>
    </div>
  );
}

export default ContainerWithHeader;
