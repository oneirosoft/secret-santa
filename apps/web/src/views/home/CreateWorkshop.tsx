import { useMemo, useState, type RefObject } from 'react'
import Button from '../../components/button/Button'
import Input from '../../components/input/Input'
import './CreateWorkshop.styles.css'

export type CreateWorkshopProps = {
  workshopNameRef: RefObject<HTMLInputElement | null>
  dollarLimitRef: RefObject<HTMLInputElement | null>
  isCreating: boolean
  createError: string
  onSubmit: (players: string[]) => void
  onCancel: () => void
}

const CreateWorkshop = ({
  workshopNameRef,
  dollarLimitRef,
  isCreating,
  createError,
  onSubmit,
  onCancel,
}: CreateWorkshopProps) => {
  const [players, setPlayers] = useState<string[]>([])
  const [playerInput, setPlayerInput] = useState('')
  const hasPlayers = useMemo(() => players.length > 0, [players])

  const addPlayer = () => {
    const nickname = playerInput.trim()
    if (nickname && !players.includes(nickname)) {
      setPlayers([...players, nickname])
      setPlayerInput('')
    }
  }

  const removePlayer = (nickname: string) => {
    setPlayers(players.filter((p) => p !== nickname))
  }

  const handleCancel = () => {
    setPlayers([])
    setPlayerInput('')
    onCancel()
  }

  return (
    <div className="create-workshop-form">
      <div className="form-field">
        <label>Workshop Name:</label>
        <Input
          type="text"
          placeholder="Enter workshop name"
          ref={workshopNameRef}
        />
      </div>

      <div className="form-field">
        <label>Dollar Limit:</label>
        <div className="currency-input">
          <span className="currency-prefix">$</span>
          <Input
            type="number"
            placeholder="0"
            ref={dollarLimitRef}
            min="0"
            className="dollar-limit-input"
          />
        </div>
      </div>

      <div className="form-field">
        <label>Add Players:</label>
        <div className="player-input-row">
          <Input
            type="text"
            placeholder="Enter player nickname"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          />
          <Button variant="secondary" onClick={addPlayer}>
            Add
          </Button>
        </div>
        {hasPlayers && (
          <div className="player-list">
            {players.map((player) => (
              <div key={player} className="player-chip">
                <span>{player}</span>
                <button onClick={() => removePlayer(player)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <Button
          variant="primary"
          onClick={() => onSubmit(players)}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Workshop'}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {createError && (
        <div className="workshop-error">
          <p>{createError}</p>
        </div>
      )}
    </div>
  )
}

export default CreateWorkshop
