import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'btn',
          variant === 'default' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'outline' && 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
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