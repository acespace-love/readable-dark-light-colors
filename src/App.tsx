import { useLocalStorage } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { getAdaptedColor, adaptGradientColors } from './utils/colorUtils';

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
  const [gradientColors, setGradientColors] = useLocalStorage<string[]>('theme-gradient-colors', ['#646cff']);

  // Calculate adapted colors for both modes
  const darkModeColor = getAdaptedColor(userColor, 'dark');
  const lightModeColor = getAdaptedColor(userColor, 'light');

  // Adapted gradient colors for both modes
  const darkModeGradientColors = adaptGradientColors(gradientColors, 'dark');
  const lightModeGradientColors = adaptGradientColors(gradientColors, 'light');

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen`}>
      <div className={'bg-white dark:bg-zinc-900 min-h-screen'}>
        <div className={clsx('w-full max-w-[800px] mx-auto py-8 px-4')}>
          <h1 className="text-3xl font-bold mb-6 text-center text-dual-darkest">Theme Color Tester</h1>

          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <UsernameInput username={username} setUsername={setUsername} />

          <div className="flex flex-wrap justify-center gap-3 my-3">
            <ThemePreview username={username} selectedColor={userColor} gradientColors={gradientColors} mode="light" />

            <ThemePreview username={username} selectedColor={userColor} gradientColors={gradientColors} mode="dark" />
          </div>

          <GradientControls
            userColor={userColor}
            setUserColor={setUserColor}
            setGradientColors={setGradientColors}
            gradientColors={gradientColors}
            lightModeColor={lightModeColor}
            darkModeColor={darkModeColor}
            isDarkMode={isDarkMode}
            darkModeGradientColors={darkModeGradientColors}
            lightModeGradientColors={lightModeGradientColors}
          />

          <ColorPresets setUserColor={setUserColor} setGradientColors={setGradientColors} />
        </div>
      </div>
    </div>
  );
}

export default App;
