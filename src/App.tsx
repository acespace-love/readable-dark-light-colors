import { useLocalStorage } from '@uidotdev/usehooks';
import clsx from 'clsx';
import {
  getAdaptedColor,
  adaptGradientColors,
  getTextColor,
  getContrastRatio,
  isWCAGCompliant,
} from './utils/colorUtils';

// Import components
import ThemeToggle from './components/ThemeToggle';
import UsernameInput from './components/UsernameInput';
import ThemePreview from './components/ThemePreview';
import GradientControls from './components/GradientControls';
import ColorPresets from './components/ColorPresets';

function App() {
  // Use localStorage to persist user preferences
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('theme-dark-mode', false);
  const [userColor, setUserColor] = useLocalStorage<string>('theme-user-color', '#646cff');
  const [username, setUsername] = useLocalStorage<string>('theme-username', 'GradientUser123');
  const [gradientColors, setGradientColors] = useLocalStorage<string[]>('theme-gradient-colors', [
    '#646cff',
  ]);

  // Calculate adapted colors for both modes
  const darkModeColor = getAdaptedColor(userColor, true);
  const lightModeColor = getAdaptedColor(userColor, false);

  // Get the actual color to use based on current mode
  const currentThemeColor = isDarkMode ? darkModeColor : lightModeColor;

  // Calculate text colors
  const darkModeTextColor = getTextColor(darkModeColor);
  const lightModeTextColor = getTextColor(lightModeColor);

  // Calculate contrast ratios and WCAG compliance
  const lightModeContrast = getContrastRatio(lightModeColor, lightModeTextColor);
  const darkModeContrast = getContrastRatio(darkModeColor, darkModeTextColor);
  const isLightModeWCAGCompliant = isWCAGCompliant(lightModeColor, lightModeTextColor);
  const isDarkModeWCAGCompliant = isWCAGCompliant(darkModeColor, darkModeTextColor);

  // Adapted gradient colors for both modes
  const darkModeGradientColors = adaptGradientColors(gradientColors, true);
  const lightModeGradientColors = adaptGradientColors(gradientColors, false);

  // Add color to gradient
  const addColorToGradient = () => {
    if (gradientColors.length < 6) {
      setGradientColors([...gradientColors, userColor]);
    }
  };

  // Remove color from gradient
  const removeColorFromGradient = (indexToRemove: number) => {
    if (gradientColors.length > 1) {
      setGradientColors(gradientColors.filter((_, index) => index !== indexToRemove));
    }
  };

  // Update a specific color in the gradient
  const updateGradientColor = (index: number, newColor: string) => {
    const newColors = [...gradientColors];
    newColors[index] = newColor;
    setGradientColors(newColors);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={'bg-white dark:bg-black'}>
        <div className={clsx('w-full max-w-[800px] mx-auto')}>
          <h1 className="text-2xl font-bold mb-4">Theme Color Tester</h1>

          <ThemeToggle
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            currentThemeColor={currentThemeColor}
            textColor={isDarkMode ? darkModeTextColor : lightModeTextColor}
          />

          <UsernameInput username={username} setUsername={setUsername} />

          <div className="flex flex-wrap justify-center gap-3 my-3">
            <ThemePreview
              username={username}
              selectedColor={userColor}
              gradientColors={gradientColors}
              mode="light"
            />

            <ThemePreview
              username={username}
              selectedColor={userColor}
              gradientColors={gradientColors}
              mode="dark"
            />
          </div>

          <GradientControls
            userColor={userColor}
            setUserColor={setUserColor}
            gradientColors={gradientColors}
            updateGradientColor={updateGradientColor}
            addColorToGradient={addColorToGradient}
            removeColorFromGradient={removeColorFromGradient}
            lightModeColor={lightModeColor}
            darkModeColor={darkModeColor}
            isDarkMode={isDarkMode}
            darkModeGradientColors={darkModeGradientColors}
            lightModeGradientColors={lightModeGradientColors}
          />

          <ColorPresets
            setUserColor={setUserColor}
            setGradientColors={setGradientColors}
            setUsername={setUsername}
            lightModeContrast={lightModeContrast}
            darkModeContrast={darkModeContrast}
            isLightModeWCAGCompliant={isLightModeWCAGCompliant}
            isDarkModeWCAGCompliant={isDarkModeWCAGCompliant}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
