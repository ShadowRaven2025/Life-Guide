import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface EnhancedGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  shimmer?: boolean
  width?: 'default' | 'narrow' | 'wide' | 'full' | 'compact'
  borderStyle?: 'default' | 'thin' | 'thick' | 'glow' | 'none'
}

const EnhancedGlassButton = forwardRef<HTMLButtonElement, EnhancedGlassButtonProps>(
  ({
    className,
    children,
    variant = 'primary',
    size = 'md',
    glow = true,
    shimmer = true,
    width = 'default',
    borderStyle = 'default',
    ...props
  }, ref) => {
    return (
      <button
        className={cn(
          'relative rounded-lg backdrop-blur-md font-medium transition-all duration-300',
          'hover:-translate-y-0.5 active:translate-y-0',
          'mx-auto',

          // Ширина
          width === 'narrow' && 'w-[180px]',
          width === 'default' && 'w-[280px]',
          width === 'wide' && 'w-[350px]',
          width === 'compact' && 'w-[240px]',
          width === 'full' && 'w-full',

          // Размеры
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2.5 text-base',
          size === 'lg' && 'px-5 py-3 text-lg',
          size === 'xl' && 'px-6 py-3.5 text-xl',

          // Стили границы
          borderStyle === 'default' && 'border',
          borderStyle === 'thin' && 'border border-[1px]',
          borderStyle === 'thick' && 'border-2',
          borderStyle === 'glow' && 'border shadow-[0_0_5px_rgba(255,255,255,0.2)]',
          borderStyle === 'none' && 'border-0',

          // Варианты цвета
          variant === 'default' && 'bg-background/70 border-glass-border text-foreground hover:bg-background/90',
          variant === 'primary' && 'bg-background/60 border-blue-600 text-foreground hover:bg-background/70 dark:bg-background/60 dark:border-blue-700 dark:hover:bg-background/70',
          variant === 'secondary' && 'bg-background/60 border-purple-600 text-foreground hover:bg-background/70 dark:bg-background/60 dark:border-purple-700 dark:hover:bg-background/70',
          variant === 'accent' && 'bg-background/60 border-indigo-600 text-foreground hover:bg-background/70 dark:bg-background/60 dark:border-indigo-700 dark:hover:bg-background/70',
          variant === 'success' && 'bg-background/60 border-green-600 text-foreground hover:bg-background/70 dark:bg-background/60 dark:border-green-700 dark:hover:bg-background/70',
          variant === 'warning' && 'bg-background/60 border-orange-600 text-foreground hover:bg-background/70 dark:bg-background/60 dark:border-orange-700 dark:hover:bg-background/70',
          variant === 'danger' && 'bg-background/60 border-red-600 text-foreground hover:bg-background/70 dark:bg-background/60 dark:border-red-700 dark:hover:bg-background/70',

          // Эффект свечения
          glow && variant === 'default' && 'hover:shadow-glow',
          glow && variant === 'primary' && 'hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]',
          glow && variant === 'secondary' && 'hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]',
          glow && variant === 'accent' && 'hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]',
          glow && variant === 'success' && 'hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]',
          glow && variant === 'warning' && 'hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]',
          glow && variant === 'danger' && 'hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]',

          // Состояние disabled
          'disabled:opacity-50 disabled:pointer-events-none',

          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-20">{children}</span>

        {/* Эффект блеска */}
        {shimmer && (
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute inset-0 z-10 animate-glass-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        )}
      </button>
    )
  }
)

EnhancedGlassButton.displayName = 'EnhancedGlassButton'

export { EnhancedGlassButton }
