import Input from '@/components/Input'
import Button from '@/components/Button'
import './phrase-input.css'
import { useRef } from 'react'

interface PhraseInput {
    onClick?: (phrase: string) => void
}

const PhraseInput = ({ onClick }: PhraseInput) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const handleClick = () => {
        if (inputRef?.current?.value)
            onClick?.(inputRef.current?.value)
    }
    return (
        <div className="phrase-input">
            <Input name='workshop-phrase' ref={inputRef} type='text' fullWidth label='Workshop Phrase' />
            <Button onClick={handleClick}>Enter Workshop</Button>
        </div>
    )
}

export default PhraseInput