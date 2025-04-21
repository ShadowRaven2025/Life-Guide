'use client'

import { useState, useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    console.log('Setting dark mode:', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
      console.log('Added dark class to html element')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Removed dark class from html element')
    }
    console.log('Current html classes:', document.documentElement.className)
  }, [darkMode])

  return (
    <>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-4 right-4 p-2 rounded-full bg-primary text-primary-foreground dark:bg-primary/90 dark:hover:bg-primary"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      {children}
    </>
  )
}