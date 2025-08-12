'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { themes, getThemeById, getDefaultTheme, type Theme } from './themes'

interface ThemeContextType {
  theme: Theme
  setTheme: (themeId: string) => void
  availableThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ 
  children,
  defaultThemeId = 'default'
}: { 
  children: React.ReactNode
  defaultThemeId?: string
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getThemeById(defaultThemeId) || getDefaultTheme()
  })

  const setTheme = (themeId: string) => {
    const newTheme = getThemeById(themeId)
    if (newTheme) {
      setThemeState(newTheme)
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTheme', themeId)
      }
    }
  }

  useEffect(() => {
    // Load saved theme from localStorage
    if (typeof window !== 'undefined') {
      const savedThemeId = localStorage.getItem('selectedTheme')
      if (savedThemeId) {
        const savedTheme = getThemeById(savedThemeId)
        if (savedTheme) {
          setThemeState(savedTheme)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme CSS variables to document root
    if (typeof document !== 'undefined' && theme) {
      const root = document.documentElement
      root.style.setProperty('--primary-color', theme.primaryColor)
      root.style.setProperty('--secondary-color', theme.secondaryColor)
      root.style.setProperty('--background-color', theme.backgroundColor)
      root.style.setProperty('--text-color', theme.textColor)
      root.style.setProperty('--border-radius', theme.borderRadius || '0.5rem')
      root.style.setProperty('--card-background', theme.cardBackground || theme.backgroundColor)
      root.style.setProperty('--card-border', theme.cardBorder || theme.primaryColor)
      
      // Generate dynamic gradients and effects
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`)
      root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)`)
      
      // Generate glow effects
      const primaryRgb = hexToRgb(theme.primaryColor)
      const secondaryRgb = hexToRgb(theme.secondaryColor)
      if (primaryRgb) {
        root.style.setProperty('--glow-primary', `0 0 40px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`)
      }
      if (secondaryRgb) {
        root.style.setProperty('--glow-secondary', `0 0 40px rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.5)`)
      }
      
      // Apply font
      if (theme.font) {
        document.body.style.fontFamily = `${theme.font}, system-ui, -apple-system, sans-serif`
      }

      // Apply background gradient if exists
      if (theme.backgroundGradient) {
        document.body.style.background = theme.backgroundGradient
      } else {
        document.body.style.background = theme.backgroundColor
      }
    }
  }, [theme])

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        availableThemes: themes 
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}