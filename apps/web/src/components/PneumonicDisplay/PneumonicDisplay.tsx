import type { Pneumonic } from '@secret-santa/domain'
import { useToast } from '@/components/Toast'
import './pneumonic-display.css'

interface PneumonicDisplayProps {
  pneumonic: Pneumonic
}

const PneumonicDisplay = ({ pneumonic }: PneumonicDisplayProps) => {
  const { showToast } = useToast()

  const handleCopyPneumonic = async () => {
    if (pneumonic.value) {
      await navigator.clipboard.writeText(pneumonic.value)
      showToast('Pneumonic copied to clipboard!')
    }
  }

  return (
    <div className='pneumonic-container'>
      <button className='pneumonic' onClick={handleCopyPneumonic} title='Click to copy'>
        {pneumonic.value}
      </button>
      <p className='pneumonic-help'>This is your workshop code. Click to copy.</p>
    </div>
  )
}

export default PneumonicDisplay
