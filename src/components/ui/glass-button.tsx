import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  glow?: boolean
  shimmer?: boolean
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    glow = false,
    shimmer = false,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          'relative overflow-hidden rounded-lg font-medium transition-all duration-300',
          'flex items-center justify-center',
          'backdrop-blur-md',
          size === 'sm' && 'text-sm px-3 py-1.5',
          size === 'md' && 'px-4 py-2',
          size === 'lg' && 'text-lg px-6 py-3',
          size === 'icon' && 'p-2',
          variant === 'default' && 'bg-background/50 border border-glass-border hover:bg-primary/5 hover:border-primary/30',
          variant === 'primary' && 'bg-primary/80 text-white border border-primary/50 hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary/30 border border-secondary/20 hover:bg-secondary/40',
          variant === 'outline' && 'bg-transparent border border-glass-border hover:bg-primary/5 hover:border-primary/30',
          glow && 'shadow-glow hover:shadow-glow-lg',
          'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {shimmer && (
          <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <span className="absolute inset-0 z-0 animate-glass-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
          </span>
        )}
      </button>
    )
  }
)

GlassButton.displayName = 'GlassButton'

export { GlassButton }
