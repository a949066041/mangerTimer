import { createContext, use } from 'react'

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

export const ThemeContext = createContext({
  toggle: () => {},
  themeName: Themes.LIGHT,
  set: (_isDark: boolean) => {},
})

export function useTheme() {
  const context = use(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

export * from './ThemeProvider'
