import { useState, useEffect } from 'react'
import tinycolor from 'tinycolor2'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [userColor, setUserColor] = useState('#646cff') // Default color
  const [username, setUsername] = useState('GradientUser123')
  const [gradientColors, setGradientColors] = useState<string[]>(['#646cff'])

  useEffect(() => {
    // Apply theme to root element
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Advanced color adaptation function using TinyColor
  const getAdaptedColor = (color: string, forDarkMode: boolean): string => {
    const colorObj = tinycolor(color)
    const brightness = colorObj.getBrightness()
    const hsl = colorObj.toHsl()
    const isDark = brightness < 128
    
    // Special case for colors that are very close to white or black
    if (brightness > 240) { // Very light colors (white or near-white)
      return forDarkMode 
        ? color // Keep white as white in dark mode
        : tinycolor({ h: hsl.h, s: hsl.s, l: 0.15 }).toString() // Make it very dark in light mode
    }
    
    if (brightness < 30) { // Very dark colors (black or near-black)
      return forDarkMode
        ? tinycolor({ h: hsl.h, s: hsl.s, l: 0.85 }).toString() // Make it very light in dark mode
        : color // Keep black as black in light mode
    }
    
    if (forDarkMode) {
      // For dark mode backgrounds
      if (isDark) {
        // Dark colors need to be lightened for dark mode
        // Make more saturated colors stand out in dark mode
        if (hsl.s > 0.6) {
          return tinycolor(color).lighten(25).saturate(5).toString()
        } else {
          return tinycolor(color).lighten(30).saturate(10).toString()
        }
      } else {
        // Light colors might need slight adjustment in dark mode
        return tinycolor(color).lighten(5).saturate(5).toString()
      }
    } else {
      // For light mode backgrounds
      if (!isDark) {
        // Light colors need to be darkened for light mode
        // Make more saturated colors stand out in light mode
        if (hsl.s > 0.6) {
          return tinycolor(color).darken(25).saturate(5).toString()
        } else {
          return tinycolor(color).darken(30).saturate(10).toString()
        }
      } else {
        // Dark colors might need slight adjustment in light mode
        return tinycolor(color).darken(5).saturate(5).toString()
      }
    }
  }

  // Adapt all gradient colors for the current mode
  const adaptGradientColors = (colors: string[], forDarkMode: boolean): string[] => {
    return colors.map(color => getAdaptedColor(color, forDarkMode))
  }

  // Create a CSS gradient string from colors
  const createGradientString = (colors: string[]): string => {
    if (colors.length === 1) {
      return colors[0]
    }
    
    const colorStops = colors.map((color, index) => {
      const percentage = (index / (colors.length - 1)) * 100
      return `${color} ${percentage}%`
    }).join(', ')
    
    return `linear-gradient(to right, ${colorStops})`
  }

  // Calculate adapted colors for both modes
  const darkModeColor = getAdaptedColor(userColor, true)
  const lightModeColor = getAdaptedColor(userColor, false)
  
  // Get the actual color to use based on current mode
  const currentThemeColor = isDarkMode ? darkModeColor : lightModeColor

  // Calculate contrasting text colors based on WCAG guidelines
  const getTextColor = (bgColor: string): string => {
    const color = tinycolor(bgColor)
    // Calculate contrast ratio with white and black
    const contrastWithWhite = tinycolor.readability(color, "#ffffff")
    const contrastWithBlack = tinycolor.readability(color, "#000000")
    
    // WCAG AA requires a contrast ratio of at least 4.5:1 for normal text
    // Return the color with better contrast
    return contrastWithWhite > contrastWithBlack ? "#ffffff" : "#000000"
  }

  const darkModeTextColor = getTextColor(darkModeColor)
  const lightModeTextColor = getTextColor(lightModeColor)

  // Calculate contrast ratios and WCAG compliance
  const lightModeContrast = tinycolor.readability(lightModeColor, lightModeTextColor)
  const darkModeContrast = tinycolor.readability(darkModeColor, darkModeTextColor)
  
  // WCAG AA standard requires a minimum contrast ratio of 4.5:1 for normal text
  const isLightModeWCAGCompliant = lightModeContrast >= 4.5
  const isDarkModeWCAGCompliant = darkModeContrast >= 4.5

  // Adapted gradient colors for both modes
  const darkModeGradientColors = adaptGradientColors(gradientColors, true)
  const lightModeGradientColors = adaptGradientColors(gradientColors, false)
  
  // Create gradient strings for both modes
  const darkModeGradient = createGradientString(darkModeGradientColors)
  const lightModeGradient = createGradientString(lightModeGradientColors)

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
          style={{ backgroundColor: currentThemeColor, color: isDarkMode ? darkModeTextColor : lightModeTextColor }}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <div className="current-mode">Current Mode: {isDarkMode ? 'Dark' : 'Light'}</div>
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
        <div className="preview-box light-preview">
          <h3>Light Mode Preview</h3>
          <div className="content-preview">
            <div className="username-preview">
              <span 
                className="gradient-username"
                style={{ 
                  backgroundImage: lightModeGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {username}
              </span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: lightModeColor }}></div>
            <p style={{ color: lightModeColor }}>Text in your selected color</p>
            <button style={{ backgroundColor: lightModeColor, color: lightModeTextColor }}>
              Button with your color
            </button>
          </div>
        </div>
        
        <div className="preview-box dark-preview">
          <h3>Dark Mode Preview</h3>
          <div className="content-preview">
            <div className="username-preview">
              <span 
                className="gradient-username"
                style={{ 
                  backgroundImage: darkModeGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {username}
              </span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: darkModeColor }}></div>
            <p style={{ color: darkModeColor }}>Text in your selected color</p>
            <button style={{ backgroundColor: darkModeColor, color: darkModeTextColor }}>
              Button with your color
            </button>
          </div>
        </div>
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
            style={{ backgroundImage: isDarkMode ? darkModeGradient : lightModeGradient }}
          ></div>
        </div>
      </div>
      
      <div className="color-explanation">
        <h3>Color Information</h3>
        <div className="color-info-grid">
          <div>
            <p><strong>Original Color:</strong></p>
            <div className="color-sample" style={{ backgroundColor: userColor }}></div>
            <code>{userColor}</code>
          </div>
          <div>
            <p><strong>Light Mode:</strong></p>
            <div className="color-sample" style={{ backgroundColor: lightModeColor }}></div>
            <code>{lightModeColor}</code>
          </div>
          <div>
            <p><strong>Dark Mode:</strong></p>
            <div className="color-sample" style={{ backgroundColor: darkModeColor }}></div>
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
      </div>
    </div>
  )
}

export default App