import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import './Input.styles.css'

type InputVariant = 'text' | 'number' | 'select'

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  variant?: InputVariant
}

export type SelectProps = ComponentPropsWithoutRef<'select'>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} {...props} className={`input ${className}`} />
  }
)

Input.displayName = 'Input'

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={`input input-select ${className}`}
      />
    )
  }
)

Select.displayName = 'Select'

export default Input
