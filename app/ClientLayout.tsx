'use client'

import { ThemeProvider } from './ThemeProvider'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground dark:bg-background dark:text-foreground">
        {children}
      </div>
    </ThemeProvider>
  )
}