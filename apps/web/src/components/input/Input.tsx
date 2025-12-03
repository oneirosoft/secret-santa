import type { ComponentPropsWithoutRef } from 'react'
import './Input.styles.css'

type InputVariant = 'text' | 'number' | 'select'

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  variant?: InputVariant
}

export type SelectProps = ComponentPropsWithoutRef<'select'>

const Input = ({ className = '', ...props }: InputProps) => {
  return <input {...props} className={`input ${className}`} />
}

export const Select = ({ className = '', ...props }: SelectProps) => {
  return <select {...props} className={`input input-select ${className}`} />
}

export default Input
