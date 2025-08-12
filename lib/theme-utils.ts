import { type Theme } from './themes'

export function generateThemeCSS(theme: Theme): string {
  return `
    :root {
      --primary-color: ${theme.primaryColor};
      --secondary-color: ${theme.secondaryColor};
      --background-color: ${theme.backgroundColor};
      --text-color: ${theme.textColor};
      --border-radius: ${theme.borderRadius || '0.5rem'};
      --card-background: ${theme.cardBackground || theme.backgroundColor};
      --card-border: ${theme.cardBorder || theme.primaryColor};
    }

    body {
      font-family: ${theme.font}, system-ui, -apple-system, sans-serif;
      background: ${theme.backgroundGradient || theme.backgroundColor};
      color: ${theme.textColor};
    }

    .theme-primary {
      color: ${theme.primaryColor};
    }

    .theme-secondary {
      color: ${theme.secondaryColor};
    }

    .theme-bg-primary {
      background-color: ${theme.primaryColor};
    }

    .theme-bg-secondary {
      background-color: ${theme.secondaryColor};
    }

    .theme-border-primary {
      border-color: ${theme.primaryColor};
    }

    .theme-border-secondary {
      border-color: ${theme.secondaryColor};
    }

    .theme-card {
      background: ${theme.cardBackground || theme.backgroundColor};
      border-color: ${theme.cardBorder || theme.primaryColor};
      border-radius: ${theme.borderRadius || '0.5rem'};
    }

    .theme-button {
      border-radius: ${
        theme.buttonStyle === 'pill' ? '9999px' :
        theme.buttonStyle === 'square' ? '0' :
        theme.borderRadius || '0.5rem'
      };
    }
  `
}

export function getThemeClasses(theme: Theme) {
  return {
    primary: `text-[${theme.primaryColor}]`,
    secondary: `text-[${theme.secondaryColor}]`,
    background: `bg-[${theme.backgroundColor}]`,
    text: `text-[${theme.textColor}]`,
    card: `bg-[${theme.cardBackground || theme.backgroundColor}] border-[${theme.cardBorder || theme.primaryColor}]`,
    button: theme.buttonStyle === 'pill' ? 'rounded-full' :
            theme.buttonStyle === 'square' ? 'rounded-none' :
            'rounded-md'
  }
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent / 100))
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent / 100))
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent / 100))
  
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const r = Math.max(0, Math.round(rgb.r * (100 - percent) / 100))
  const g = Math.max(0, Math.round(rgb.g * (100 - percent) / 100))
  const b = Math.max(0, Math.round(rgb.b * (100 - percent) / 100))
  
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}