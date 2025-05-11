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
    <div className="w-full max-w-[800px] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Theme Color Tester</h1>

      <div className="flex flex-col items-center gap-2.5 my-5">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-5 py-2.5 text-base font-semibold border-none rounded cursor-pointer transition-all duration-300 ease-in-out hover:opacity-90 hover:-translate-y-0.5"
          style={{
            backgroundColor: currentThemeColor,
            color: isDarkMode ? darkModeTextColor : lightModeTextColor
          }}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <div className="text-sm font-medium text-[var(--text-secondary)]">
          Current Mode: {isDarkMode ? 'Dark' : 'Light'}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5 my-6">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          className="px-3 py-2 text-base border border-[var(--border-color)] rounded bg-[var(--background)] text-[var(--text-primary)] w-[200px] transition-colors duration-300 focus:outline-none focus:border-[var(--accent-color)] focus:shadow"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-5 my-8">
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

      <div className="bg-[var(--card-bg)] p-5 rounded-lg my-8 border border-[var(--border-color)]">
        <h3 className="text-xl font-semibold mb-3">Gradient Colors (1-6)</h3>
        <div className="flex flex-wrap items-center justify-center gap-2.5 my-6">
          <label htmlFor="color-picker">Choose Color: </label>
          <input
            type="color"
            id="color-picker"
            value={userColor}
            onChange={(e) => setUserColor(e.target.value)}
            className="w-[60px] h-[40px] border-none rounded cursor-pointer bg-transparent"
          />
          <div className="font-mono px-2 py-1 bg-[var(--card-bg)] rounded text-[var(--text-primary)]">{userColor}</div>
          <button
            className="px-3 py-2 bg-[var(--accent-color)] text-white border-none rounded cursor-pointer font-medium transition-all duration-200 hover:opacity-90 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={addColorToGradient}
            disabled={gradientColors.length >= 6}
          >
            Add to Gradient
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 my-5">
          {gradientColors.map((color, index) => (
            <div key={index} className="flex items-center gap-2 bg-black/[0.03] dark:bg-white/[0.03] p-3 rounded relative">
              <div
                className="w-5 h-5 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              ></div>
              <input
                type="color"
                value={color}
                onChange={(e) => updateGradientColor(index, e.target.value)}
                className="w-[30px] h-[30px] border-none bg-transparent cursor-pointer"
              />
              <code className="font-mono text-sm">{color}</code>
              {gradientColors.length > 1 && (
                <button
                  className="w-6 h-6 rounded-full border-none bg-red-500 text-white text-base flex items-center justify-center cursor-pointer ml-1.5 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                  onClick={() => removeColorFromGradient(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
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

      <div className="mt-8 p-5 rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)]">
        <h3 className="text-xl font-semibold mt-0">Color Information</h3>
        <div className="flex flex-wrap justify-center gap-5 my-5">
          <div className="flex-1 min-w-[120px] flex flex-col items-center">
            <p><strong>Original Color:</strong></p>
            <div
              className="w-[60px] h-[60px] rounded my-2.5 border border-black/10"
              style={{ backgroundColor: userColor }}
            ></div>
            <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded text-sm">{userColor}</code>
          </div>
          <div className="flex-1 min-w-[120px] flex flex-col items-center">
            <p><strong>Light Mode:</strong></p>
            <div
              className="w-[60px] h-[60px] rounded my-2.5 border border-black/10"
              style={{ backgroundColor: lightModeColor }}
            ></div>
            <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded text-sm">{lightModeColor}</code>
          </div>
          <div className="flex-1 min-w-[120px] flex flex-col items-center">
            <p><strong>Dark Mode:</strong></p>
            <div
              className="w-[60px] h-[60px] rounded my-2.5 border border-black/10"
              style={{ backgroundColor: darkModeColor }}
            ></div>
            <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded text-sm">{darkModeColor}</code>
          </div>
        </div>
        <div className="mt-5 p-4 bg-black/[0.03] dark:bg-white/[0.05] rounded-md text-left">
          <p><strong>Contrast Check:</strong></p>
          <p>
            Light mode contrast: {lightModeContrast.toFixed(2)}
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ml-2 ${isLightModeWCAGCompliant ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isLightModeWCAGCompliant ? 'PASS' : 'FAIL'}
            </span>
          </p>
          <p>
            Dark mode contrast: {darkModeContrast.toFixed(2)}
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ml-2 ${isDarkModeWCAGCompliant ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isDarkModeWCAGCompliant ? 'PASS' : 'FAIL'}
            </span>
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-5">
            WCAG AA standard requires a minimum contrast ratio of 4.5:1 for normal text.
          </p>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mt-5">
          Try these colors to see how the algorithm adapts them:
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 my-4">
          <button onClick={() => setUserColor('#ffffff')} style={{backgroundColor: '#ffffff', color: '#000000'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">White</button>
          <button onClick={() => setUserColor('#000000')} style={{backgroundColor: '#000000', color: '#ffffff'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">Black</button>
          <button onClick={() => setUserColor('#ff0000')} style={{backgroundColor: '#ff0000', color: '#ffffff'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">Red</button>
          <button onClick={() => setUserColor('#00ff00')} style={{backgroundColor: '#00ff00', color: '#000000'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">Green</button>
          <button onClick={() => setUserColor('#0000ff')} style={{backgroundColor: '#0000ff', color: '#ffffff'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">Blue</button>
          <button onClick={() => setUserColor('#ff00ff')} style={{backgroundColor: '#ff00ff', color: '#ffffff'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">Pink</button>
          <button onClick={() => setUserColor('#ffff00')} style={{backgroundColor: '#ffff00', color: '#000000'}} className="border-none rounded px-3 py-2 min-w-[70px] text-sm font-semibold cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">Yellow</button>
        </div>

        <div className="mt-4">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-[var(--text-primary)] font-medium rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={() => {
              // Reset all settings to defaults
              setUserColor('#646cff');
              setGradientColors(['#646cff']);
              setUsername('GradientUser123');
              // Keep the current theme to avoid jarring changes
            }}
          >
            Reset to Default Colors
          </button>
        </div>
      </div>
    </div>
  )
}

export default App