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
      
      // Apply font
      if (theme.font) {
        document.body.style.fontFamily = theme.font
      }

      // Apply background gradient if exists
      if (theme.backgroundGradient) {
        document.body.style.background = theme.backgroundGradient
      } else {
        document.body.style.background = theme.backgroundColor
      }
    }
  }, [theme])

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