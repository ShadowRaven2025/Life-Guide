import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface EnhancedGlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  glow?: boolean
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  width?: 'default' | 'narrow' | 'wide' | 'full' | 'compact'
  borderStyle?: 'default' | 'thin' | 'thick' | 'glow' | 'none'
}

const EnhancedGlassInput = forwardRef<HTMLInputElement, EnhancedGlassInputProps>(
  ({ className, type, glow = true, icon, variant = 'default', width = 'default', borderStyle = 'default', ...props }, ref) => {
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
            'rounded-lg backdrop-blur-md',
            'px-4 py-2.5 text-foreground',
            'transition-all duration-300',
            'focus:outline-none',
            'mx-auto block',

            // Ширина
            width === 'narrow' && 'w-[180px]',
            width === 'default' && 'w-[280px]',
            width === 'wide' && 'w-[350px]',
            width === 'compact' && 'w-[240px]',
            width === 'full' && 'w-full',

            // Стили границы
            borderStyle === 'default' && 'border',
            borderStyle === 'thin' && 'border border-[1px]',
            borderStyle === 'thick' && 'border-2',
            borderStyle === 'glow' && 'border shadow-[0_0_5px_rgba(255,255,255,0.2)]',
            borderStyle === 'none' && 'border-0',

            // Базовый стиль
            variant === 'default' && 'border-glass-border bg-gray-800/90 dark:bg-gray-900/90 focus:border-primary/50 text-white',

            // Стиль Primary - с темным фоном
            variant === 'primary' && 'border-blue-600 bg-gray-800/90 dark:bg-gray-900/90 focus:border-blue-700 focus:bg-gray-800/95 dark:focus:bg-gray-900/95 text-white',

            // Стиль Secondary - с темным фоном
            variant === 'secondary' && 'border-purple-600 bg-gray-800/90 dark:bg-gray-900/90 focus:border-purple-700 focus:bg-gray-800/95 dark:focus:bg-gray-900/95 text-white',

            // Стиль Accent - с темным фоном
            variant === 'accent' && 'border-indigo-600 bg-gray-800/90 dark:bg-gray-900/90 focus:border-indigo-700 focus:bg-gray-800/95 dark:focus:bg-gray-900/95 text-white',

            // Стиль Success - с темным фоном
            variant === 'success' && 'border-green-600 bg-gray-800/90 dark:bg-gray-900/90 focus:border-green-700 focus:bg-gray-800/95 dark:focus:bg-gray-900/95 text-white',

            // Стиль Warning - с темным фоном
            variant === 'warning' && 'border-orange-600 bg-gray-800/90 dark:bg-gray-900/90 focus:border-orange-700 focus:bg-gray-800/95 dark:focus:bg-gray-900/95 text-white',

            // Стиль Danger - с темным фоном
            variant === 'danger' && 'border-red-600 bg-gray-800/90 dark:bg-gray-900/90 focus:border-red-700 focus:bg-gray-800/95 dark:focus:bg-gray-900/95 text-white',

            // Эффект свечения при фокусе
            glow && variant === 'default' && 'focus:shadow-glow',
            glow && variant === 'primary' && 'focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]',
            glow && variant === 'secondary' && 'focus:shadow-[0_0_10px_rgba(168,85,247,0.3)]',
            glow && variant === 'accent' && 'focus:shadow-[0_0_10px_rgba(99,102,241,0.3)]',
            glow && variant === 'success' && 'focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]',
            glow && variant === 'warning' && 'focus:shadow-[0_0_10px_rgba(249,115,22,0.3)]',
            glow && variant === 'danger' && 'focus:shadow-[0_0_10px_rgba(239,68,68,0.3)]',

            // Отступ для иконки
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

EnhancedGlassInput.displayName = 'EnhancedGlassInput'

export { EnhancedGlassInput }
