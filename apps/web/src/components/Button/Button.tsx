import type { DetailedHTMLProps, ButtonHTMLAttributes, ReactNode } from "react"
import './button.css'

interface ButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary'
}

type ButtonElementProps = ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button = (props: ButtonElementProps) => {
    const { children, variant = 'primary', ...buttonProps } = props
    const className = `button button-${variant} ${buttonProps.className || ''}`

    return <button {...buttonProps} className={className}>
        {children}
    </button>
}

export default Button
