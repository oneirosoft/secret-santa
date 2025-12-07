import { forwardRef, useCallback, useMemo, useRef, type DetailedHTMLProps, type InputHTMLAttributes, type ReactNode } from "react"
import './input.css'

interface InputProps {
    label: string | ReactNode
    fullWidth?: boolean
}

type InputElementProps = InputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputElementProps>((props, ref) => {
    const { label, fullWidth, ...inputProps } = props
    const { name, id, ...otherInputProps } = inputProps
    const internalRef = ref ?? useRef<HTMLInputElement>(null)
    const classes = useMemo(() => {
        let classes = ''
        if (fullWidth) classes += 'full-width'
        return classes
    }, [fullWidth])

    return <div className={`input-group ${classes}`}>
        <label htmlFor={name}>{label}</label>
        <input ref={internalRef} {...otherInputProps} id={id ?? name} name={name ?? id} />
    </div>
})

Input.displayName = "Input"

export default Input