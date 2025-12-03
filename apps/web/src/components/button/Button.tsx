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
    <button {...props} className={`button button-${variant} ${className}`} />
  )
}

export default Button
