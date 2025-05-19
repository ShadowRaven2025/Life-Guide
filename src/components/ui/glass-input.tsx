import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  glow?: boolean
  icon?: React.ReactNode
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, glow = false, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'w-full rounded-lg border border-glass-border bg-background/50 backdrop-blur-md',
            'px-4 py-2 text-foreground',
            'transition-all duration-300',
            'focus:outline-none focus:border-primary/50',
            glow && 'focus:shadow-glow',
            icon && 'pl-10',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'

export { GlassInput }
