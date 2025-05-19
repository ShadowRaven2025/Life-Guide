import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  glassmorphism?: boolean
  hover?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glassmorphism = false, hover = true, shadow = 'md', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-lg p-6 transition-all duration-300',
          glassmorphism && 'glass glass-card border border-primary/10 dark:border-primary/20',
          hover && glassmorphism && 'hover:border-primary/30 hover:-translate-y-1',
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
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export { Card }
