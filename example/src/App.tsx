import { useState } from 'react';
import { DEFAULT_THEMES, createGradientString, getAdaptedColor, getTextColor } from '../../src'; // This would be 'dark-light-colours' in a real project

function ThemeToggle({ isDarkMode, setIsDarkMode }: { isDarkMode: boolean; setIsDarkMode: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-center my-4">
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
}

function ColorSample({ color }: { color: string }) {
  const textColor = getTextColor(color);

  return (
    <div
      className="h-20 w-full rounded-md flex items-center justify-center mb-4 border border-gray-300 dark:border-gray-600"
      style={{ backgroundColor: color }}
    >
      <span style={{ color: textColor }}>{color}</span>
    </div>
  );
}

function GradientSample({ colors }: { colors: string[] }) {
  return (
    <div
      className="h-20 w-full rounded-md flex items-center justify-center mb-4 border border-gray-300 dark:border-gray-600"
      style={{ background: createGradientString(colors) }}
    >
      <span className="bg-white/70 dark:bg-black/70 px-2 py-1 rounded text-sm">
        {colors.length > 1 ? 'Gradient' : 'Solid'} ({colors.join(', ')})
      </span>
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('DEFAULT');

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-zinc-900 min-h-screen text-dual-darkest p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Dark Light Colours Demo</h1>

          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-md">
              <h2 className="text-xl font-bold mb-4">Original Color</h2>
              <ColorSample color={DEFAULT_THEMES[currentTheme][0]} />
            </div>

            <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-md">
              <h2 className="text-xl font-bold mb-4">Adapted for {isDarkMode ? 'Dark' : 'Light'} Mode</h2>
              <ColorSample color={getAdaptedColor(DEFAULT_THEMES[currentTheme][0], isDarkMode ? 'dark' : 'light')} />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Gradient Preview</h2>
            <GradientSample colors={DEFAULT_THEMES[currentTheme]} />
          </div>

          <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-md">
            <h2 className="text-xl font-bold mb-4">Color Themes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(DEFAULT_THEMES).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => setCurrentTheme(name)}
                  className={`p-2 rounded-md ${currentTheme === name ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="h-12 w-full rounded-md mb-2" style={{ background: createGradientString(colors) }} />
                  <div className="text-xs text-center">{name.toLowerCase()}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
