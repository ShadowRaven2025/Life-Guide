import { cn } from '@/lib/utils'
import { forwardRef, useState, useEffect } from 'react'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  glassmorphism?: boolean
  className?: string
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ isOpen, onClose, title, children, glassmorphism = true, className }, ref) => {
    const [isVisible, setIsVisible] = useState(isOpen)

    useEffect(() => {
      if (isOpen) {
        setIsVisible(true)
      } else {
        const timer = setTimeout(() => setIsVisible(false), 300)
        return () => clearTimeout(timer)
      }
    }, [isOpen])

    if (!isVisible && !isOpen) return null

    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'bg-black/70 backdrop-blur-sm',
          isOpen ? 'animate-fade-in' : 'opacity-0 pointer-events-none',
          'transition-opacity duration-300'
        )}
        onClick={onClose}
      >
        <div
          ref={ref}
          className={cn(
            'max-w-md w-full rounded-lg p-6',
            'transition-all duration-300',
            isOpen ? 'animate-slide-up' : 'opacity-0 translate-y-4',
            glassmorphism ? 
              'glass glass-card shadow-2xl border border-primary/10 dark:border-primary/20' : 
              'bg-background border border-border shadow-lg',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn(
                'text-2xl font-bold',
                glassmorphism && 'bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent'
              )}>
                {title}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <svg className="w-5 h-5 text-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    )
  }
)

Dialog.displayName = 'Dialog'
