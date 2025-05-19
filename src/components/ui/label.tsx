import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  glassmorphism?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, glassmorphism = false, ...props }, ref) => {
    return (
      <label
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-300',
          glassmorphism && 'text-foreground/90',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Label.displayName = 'Label'

export { Label }
