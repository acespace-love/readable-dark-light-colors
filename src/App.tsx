import { useEffect } from 'react'
import { LightModePreview, DarkModePreview } from './GradientPreview'
import { useLocalStorage } from '@uidotdev/usehooks'
import {
  getAdaptedColor,
  adaptGradientColors,
  getTextColor,
  getContrastRatio,
  isWCAGCompliant
} from './utils/colorUtils'
import clsx from 'clsx'

// ContainerWithHeader component has been moved to GradientPreview.tsx

function App() {
  // Use localStorage to persist user preferences
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('theme-dark-mode', false)
  const [userColor, setUserColor] = useLocalStorage<string>('theme-user-color', '#646cff')
  const [username, setUsername] = useLocalStorage<string>('theme-username', 'GradientUser123')
  const [gradientColors, setGradientColors] = useLocalStorage<string[]>('theme-gradient-colors', ['#646cff'])

  useEffect(() => {
    // Apply theme to root element
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Color manipulation functions are now imported from colorUtils.ts

  // Calculate adapted colors for both modes
  const darkModeColor = getAdaptedColor(userColor, true)
  const lightModeColor = getAdaptedColor(userColor, false)
  
  // Get the actual color to use based on current mode
  const currentThemeColor = isDarkMode ? darkModeColor : lightModeColor

  // getTextColor function is now imported from colorUtils.ts

  const darkModeTextColor = getTextColor(darkModeColor)
  const lightModeTextColor = getTextColor(lightModeColor)

  // Calculate contrast ratios and WCAG compliance
  const lightModeContrast = getContrastRatio(lightModeColor, lightModeTextColor)
  const darkModeContrast = getContrastRatio(darkModeColor, darkModeTextColor)

  // Check WCAG compliance using the utility function
  const isLightModeWCAGCompliant = isWCAGCompliant(lightModeColor, lightModeTextColor)
  const isDarkModeWCAGCompliant = isWCAGCompliant(darkModeColor, darkModeTextColor)

  // Adapted gradient colors for both modes
  const darkModeGradientColors = adaptGradientColors(gradientColors, true)
  const lightModeGradientColors = adaptGradientColors(gradientColors, false)

  // Add color to gradient
  const addColorToGradient = () => {
    if (gradientColors.length < 6) {
      setGradientColors([...gradientColors, userColor])
    }
  }

  // Remove color from gradient
  const removeColorFromGradient = (indexToRemove: number) => {
    if (gradientColors.length > 1) {
      setGradientColors(gradientColors.filter((_, index) => index !== indexToRemove))
    }
  }

  // Update a specific color in the gradient
  const updateGradientColor = (index: number, newColor: string) => {
    const newColors = [...gradientColors]
    newColors[index] = newColor
    setGradientColors(newColors)
  }

  return (
    <div className={clsx("w-full max-w-[800px] mx-auto", isDarkMode && "dark")}>
      <h1 className="text-2xl font-bold mb-4">Theme Color Tester</h1>

      <div className="flex items-center justify-end w-full gap-2 mb-4">
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-90"
          style={{
            backgroundColor: currentThemeColor,
            color: isDarkMode ? darkModeTextColor : lightModeTextColor
          }}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 my-3">
        <label htmlFor="username" className="text-sm">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          className="px-2 py-1 text-sm border border-[var(--border-color)] rounded bg-[var(--background)] text-[var(--text-primary)] w-[180px] transition-colors duration-300 focus:outline-none focus:border-[var(--accent-color)] focus:shadow"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 my-3">
        <LightModePreview
          username={username}
          gradientColors={gradientColors}
          adaptedLightModeColors={lightModeGradientColors}
          adaptedDarkModeColors={darkModeGradientColors}
          lightModeColor={lightModeColor}
          darkModeColor={darkModeColor}
          lightModeTextColor={lightModeTextColor}
          darkModeTextColor={darkModeTextColor}
        />

        <DarkModePreview
          username={username}
          gradientColors={gradientColors}
          adaptedLightModeColors={lightModeGradientColors}
          adaptedDarkModeColors={darkModeGradientColors}
          lightModeColor={lightModeColor}
          darkModeColor={darkModeColor}
          lightModeTextColor={lightModeTextColor}
          darkModeTextColor={darkModeTextColor}
        />
      </div>

      <div className="bg-[var(--card-bg)] p-3 rounded-lg my-4 border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold mb-2">Gradient Colors (1-6)</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <label htmlFor="color-picker" className="text-sm">Color: </label>
          <input
            type="color"
            id="color-picker"
            value={userColor}
            onChange={(e) => setUserColor(e.target.value)}
            className="w-[40px] h-[30px] border-none rounded cursor-pointer bg-transparent"
          />
          <code className="font-mono text-xs bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{userColor}</code>
          <div className="flex ml-2 text-xs gap-1 items-center">
            <span className="text-[var(--text-secondary)]">Light:</span>
            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: lightModeColor }}></div>
            <span className="text-[var(--text-secondary)]">Dark:</span>
            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: darkModeColor }}></div>
          </div>
          <button
            className="ml-2 px-2 py-1 bg-[var(--accent-color)] text-white border-none rounded text-sm cursor-pointer font-medium transition-all duration-200 hover:opacity-90 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={addColorToGradient}
            disabled={gradientColors.length >= 6}
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 my-4">
          {gradientColors.map((color, index) => {
            const contrast = getContrastRatio(color, getTextColor(color));
            const isWcagCompliant = isWCAGCompliant(color, getTextColor(color));

            return (
              <div key={index} className="flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.03] p-2 rounded relative text-xs">
                <div
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                ></div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateGradientColor(index, e.target.value)}
                  className="w-[24px] h-[24px] border-none bg-transparent cursor-pointer p-0"
                />
                <div className="flex flex-col">
                  <code className="font-mono text-xs">{color}</code>
                  <div className="flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${isWcagCompliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-[var(--text-secondary)] text-[10px]">
                      {contrast.toFixed(1)}
                    </span>
                  </div>
                </div>
                {gradientColors.length > 1 && (
                  <button
                    className="w-5 h-5 rounded-full border-none bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer ml-0.5 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                    onClick={() => removeColorFromGradient(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="my-5">
          <div
            className="h-10 rounded w-full border border-black/10"
            style={
              gradientColors.length > 1
              ? { backgroundImage: isDarkMode
                  ? `linear-gradient(to right, ${darkModeGradientColors.join(', ')})`
                  : `linear-gradient(to right, ${lightModeGradientColors.join(', ')})`
                }
              : { backgroundColor: isDarkMode
                  ? darkModeGradientColors[0]
                  : lightModeGradientColors[0]
                }
            }
          ></div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-[var(--text-secondary)]">Try preset colors:</div>
          <div className="flex gap-1">
            <button
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-[var(--text-primary)] rounded hover:opacity-90"
              onClick={() => {
                setUserColor('#646cff');
                setGradientColors(['#646cff']);
                setUsername('GradientUser123');
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1 mb-2">
          <button onClick={() => setUserColor('#ffffff')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="White">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#ffffff'}}></div>
          </button>
          <button onClick={() => setUserColor('#000000')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="Black">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#000000'}}></div>
          </button>
          <button onClick={() => setUserColor('#ff0000')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="Red">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#ff0000'}}></div>
          </button>
          <button onClick={() => setUserColor('#00ff00')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="Green">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#00ff00'}}></div>
          </button>
          <button onClick={() => setUserColor('#0000ff')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="Blue">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#0000ff'}}></div>
          </button>
          <button onClick={() => setUserColor('#ff00ff')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="Pink">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#ff00ff'}}></div>
          </button>
          <button onClick={() => setUserColor('#ffff00')} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm" title="Yellow">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#ffff00'}}></div>
          </button>
        </div>

        <div className="text-xs text-center text-[var(--text-secondary)]">
          <span className="mx-1">
            <span className={`inline-block w-2 h-2 rounded-full ${isLightModeWCAGCompliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="ml-1">Light: {lightModeContrast.toFixed(1)}</span>
          </span>
          <span className="mx-1">
            <span className={`inline-block w-2 h-2 rounded-full ${isDarkModeWCAGCompliant ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="ml-1">Dark: {darkModeContrast.toFixed(1)}</span>
          </span>
          <span className="text-[10px] ml-1">(WCAG ≥ 4.5)</span>
        </div>
      </div>
    </div>
  )
}

export default App