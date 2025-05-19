import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface GlassContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary'
  blur?: 'sm' | 'md' | 'lg'
  border?: boolean
  glow?: boolean
  innerGlow?: boolean
  shimmer?: boolean
  hover?: boolean
}

const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({
    className,
    variant = 'default',
    blur = 'md',
    border = true,
    glow = false,
    innerGlow = false,
    shimmer = false,
    hover = true,
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          'glass glass-effect rounded-lg p-6 transition-all duration-300 relative',
          border && 'glass-border',
          glow && 'shadow-glow',
          innerGlow && 'glass-inner-border',
          hover && 'hover:-translate-y-1',
          hover && glow && 'hover:shadow-glow-lg',
          blur === 'sm' && 'backdrop-blur-sm',
          blur === 'md' && 'backdrop-blur-md',
          blur === 'lg' && 'backdrop-blur-lg',
          variant === 'primary' && 'bg-primary/10 border-primary/20',
          variant === 'secondary' && 'bg-secondary/30 border-secondary/20',
          className
        )}
        ref={ref}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute inset-0 z-10 animate-glass-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

GlassContainer.displayName = 'GlassContainer'

export { GlassContainer }
