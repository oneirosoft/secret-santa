import type { ComponentPropsWithoutRef } from 'react'
import './Button.styles.css'

type Variant = 'primary' | 'secondary'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: Variant
}

const Button = ({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`button button-${variant} ${className}`}
      onFocus={(e) => {
        e.currentTarget.style.outline = '2px solid #c41e3a'
        e.currentTarget.style.outlineOffset = '2px'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = ''
        e.currentTarget.style.outlineOffset = ''
        props.onBlur?.(e)
      }}
    />
  )
}

export default Button
