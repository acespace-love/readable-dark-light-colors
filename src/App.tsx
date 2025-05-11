import { useEffect } from 'react'
import './App.css'
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
    <div className="app-container">
      <h1>Theme Color Tester</h1>

      <div className="theme-toggle">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle-button"
          style={{
            backgroundColor: currentThemeColor,
            color: isDarkMode ? darkModeTextColor : lightModeTextColor
          }}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <div className="current-mode">
          Current Mode: {isDarkMode ? 'Dark' : 'Light'}
        </div>
      </div>

      <div className="username-input">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
      </div>
      
      <div className="preview-container">
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

      <div className="gradient-controls">
        <h3>Gradient Colors (1-6)</h3>
        <div className="color-picker-container">
          <label htmlFor="color-picker">Choose Color: </label>
          <input
            type="color"
            id="color-picker"
            value={userColor}
            onChange={(e) => setUserColor(e.target.value)}
          />
          <div className="color-value">{userColor}</div>
          <button
            className="add-color-btn"
            onClick={addColorToGradient}
            disabled={gradientColors.length >= 6}
          >
            Add to Gradient
          </button>
        </div>
        
        <div className="gradient-colors-list">
          {gradientColors.map((color, index) => (
            <div key={index} className="gradient-color-item">
              <div
                className="color-preview"
                style={{ backgroundColor: color }}
              ></div>
              <input
                type="color"
                value={color}
                onChange={(e) => updateGradientColor(index, e.target.value)}
              />
              <code>{color}</code>
              {gradientColors.length > 1 && (
                <button
                  className="remove-color-btn"
                  onClick={() => removeColorFromGradient(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="gradient-preview">
          <div
            className="gradient-bar"
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
      
      <div className="color-explanation">
        <h3>Color Information</h3>
        <div className="color-info-grid">
          <div>
            <p><strong>Original Color:</strong></p>
            <div
              className="color-sample"
              style={{ backgroundColor: userColor }}
            ></div>
            <code>{userColor}</code>
          </div>
          <div>
            <p><strong>Light Mode:</strong></p>
            <div
              className="color-sample"
              style={{ backgroundColor: lightModeColor }}
            ></div>
            <code>{lightModeColor}</code>
          </div>
          <div>
            <p><strong>Dark Mode:</strong></p>
            <div
              className="color-sample"
              style={{ backgroundColor: darkModeColor }}
            ></div>
            <code>{darkModeColor}</code>
          </div>
        </div>
        <div className="color-contrast-info">
          <p><strong>Contrast Check:</strong></p>
          <p>
            Light mode contrast: {lightModeContrast.toFixed(2)}
            <span className={`wcag-badge ${isLightModeWCAGCompliant ? 'wcag-pass' : 'wcag-fail'}`}>
              {isLightModeWCAGCompliant ? 'PASS' : 'FAIL'}
            </span>
          </p>
          <p>
            Dark mode contrast: {darkModeContrast.toFixed(2)}
            <span className={`wcag-badge ${isDarkModeWCAGCompliant ? 'wcag-pass' : 'wcag-fail'}`}>
              {isDarkModeWCAGCompliant ? 'PASS' : 'FAIL'}
            </span>
          </p>
          <p className="hint">
            WCAG AA standard requires a minimum contrast ratio of 4.5:1 for normal text.
          </p>
        </div>

        <p className="hint">
          Try these colors to see how the algorithm adapts them:
        </p>
        <div className="color-suggestions">
          <button onClick={() => setUserColor('#ffffff')} style={{backgroundColor: '#ffffff', color: '#000000'}}>White</button>
          <button onClick={() => setUserColor('#000000')} style={{backgroundColor: '#000000', color: '#ffffff'}}>Black</button>
          <button onClick={() => setUserColor('#ff0000')} style={{backgroundColor: '#ff0000', color: '#ffffff'}}>Red</button>
          <button onClick={() => setUserColor('#00ff00')} style={{backgroundColor: '#00ff00', color: '#000000'}}>Green</button>
          <button onClick={() => setUserColor('#0000ff')} style={{backgroundColor: '#0000ff', color: '#ffffff'}}>Blue</button>
          <button onClick={() => setUserColor('#ff00ff')} style={{backgroundColor: '#ff00ff', color: '#ffffff'}}>Pink</button>
          <button onClick={() => setUserColor('#ffff00')} style={{backgroundColor: '#ffff00', color: '#000000'}}>Yellow</button>
        </div>

        <div className="settings-actions">
          <button
            className="reset-button"
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