'use client'

import { ThemeProvider } from './ThemeProvider'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground dark:bg-background dark:text-foreground relative flex flex-col" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Background decorative elements for glassmorphism effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

          {/* Isometric grid pattern - visible only in dark mode */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00MSA0MWgtMVYwaDFabTAgMzloLTFWNDFoMVptMzktNDFIMFY0MGg4MFptMCAxSDFWMzloNzlaIi8+PC9zdmc+')]"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col flex-grow" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}