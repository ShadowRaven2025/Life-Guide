import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  glassmorphism?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, glassmorphism = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm transition-all duration-300',
          glassmorphism ?
            'bg-background/50 backdrop-blur-sm border-glass-border focus:border-primary/50 shadow-sm' :
            'bg-background',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-muted-foreground',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
