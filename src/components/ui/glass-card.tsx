import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary'
  blur?: 'sm' | 'md' | 'lg'
  border?: boolean
  glow?: boolean
  innerGlow?: boolean
  shimmer?: boolean
  hover?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({
    className,
    variant = 'default',
    blur = 'md',
    border = true,
    glow = false,
    innerGlow = false,
    shimmer = false,
    hover = true,
    shadow = 'md',
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(
          'glass glass-effect rounded-lg p-6 transition-all duration-300 relative',
          border && 'border border-glass-border',
          hover && 'hover:-translate-y-1',
          shadow === 'sm' && 'shadow-sm',
          shadow === 'md' && 'shadow-md',
          shadow === 'lg' && 'shadow-lg',
          shadow === 'xl' && 'shadow-xl',
          shadow === '2xl' && 'shadow-2xl',
          shadow === 'none' && 'shadow-none',
          hover && shadow === 'sm' && 'hover:shadow-md',
          hover && shadow === 'md' && 'hover:shadow-lg',
          hover && shadow === 'lg' && 'hover:shadow-xl',
          hover && shadow === 'xl' && 'hover:shadow-2xl',
          glow && 'shadow-glow',
          innerGlow && 'glass-inner-border',
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

GlassCard.displayName = 'GlassCard'

export { GlassCard }
