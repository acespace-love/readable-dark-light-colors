import { useLocalStorage } from '@uidotdev/usehooks';
import clsx from 'clsx';

// Import components
import ThemeToggle from './components/ThemeToggle';
import UsernameInput from './components/UsernameInput';
import ThemePreview from './components/ThemePreview';
import GradientControls from './components/GradientControls';
import GradientBuilderWithPresets from './components/GradientBuilderWithPresets';
import {DEFAULT_THEMES} from "../../src";

// Import constants
const MAX_GRADIENT_COLORS = 6;
const DEFAULT_COLOR = DEFAULT_THEMES.DEFAULT[0];
const DEFAULT_USERNAME = 'GradientUser123';
const STORAGE_KEYS = {
  DARK_MODE: 'theme-dark-mode',
  USER_COLOR: 'theme-user-color',
  USERNAME: 'theme-username',
  GRADIENT_COLORS: 'theme-gradient-colors',
};

function App() {
  // Use localStorage to persist user preferences
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(STORAGE_KEYS.DARK_MODE, false);
  const [userColor, setUserColor] = useLocalStorage<string>(STORAGE_KEYS.USER_COLOR, DEFAULT_COLOR);
  const [username, setUsername] = useLocalStorage<string>(STORAGE_KEYS.USERNAME, DEFAULT_USERNAME);
  const [gradientColors, setGradientColors] = useLocalStorage<string[]>(STORAGE_KEYS.GRADIENT_COLORS, [DEFAULT_COLOR]);
  const mode = isDarkMode ? 'dark' : 'light';

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

          <GradientBuilderWithPresets
            gradientColors={gradientColors}
            setGradientColors={setGradientColors}
            setUserColor={setUserColor}
            maximumColorCount={MAX_GRADIENT_COLORS}
          />

          <GradientControls
            userColor={userColor}
            setUserColor={setUserColor}
            gradientColors={gradientColors}
            setGradientColors={setGradientColors}
            mode={mode}
          />

        </div>
      </div>
    </div>
  );
}

export default App;
