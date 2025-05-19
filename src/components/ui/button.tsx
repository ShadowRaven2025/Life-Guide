import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  glassmorphism?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', glassmorphism = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'btn transition-all duration-300',
          variant === 'default' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'outline' && 'border border-glass-border bg-transparent hover:bg-primary/5 hover:border-primary/30',
          variant === 'ghost' && 'hover:bg-primary/5',
          variant === 'glass' && 'glass backdrop-blur-sm bg-background/50 border border-glass-border hover:bg-primary/5 hover:border-primary/30 shadow-sm',
          glassmorphism && 'glass backdrop-blur-sm',
          size === 'sm' && 'h-9 px-3 rounded-md',
          size === 'lg' && 'h-11 px-8 rounded-md',
          size === 'icon' && 'h-10 w-10 p-0',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }