import Button from '../../components/button/Button'
import Input, { Select } from '../../components/input/Input'
import './JoinWorkshop.styles.css'
import type { RefObject } from 'react'

type Player = {
  nickname: string
}

type Workshop = {
  id: string | { value: string }
  name: string
  dollarLimit: number
  players: Player[]
}

export type JoinWorkshopProps = {
  workshopCodeRef: RefObject<HTMLInputElement | null>
  isJoining: boolean
  joinedWorkshop: Workshop | null
  selectedPlayer: string
  joinError: string
  onJoin: () => void
  onSelectPlayer: (value: string) => void
}

const JoinWorkshop = ({
  workshopCodeRef,
  isJoining,
  joinedWorkshop,
  selectedPlayer,
  joinError,
  onJoin,
  onSelectPlayer,
}: JoinWorkshopProps) => {
  return (
    <div className="join-workshop">
      <p>Already have a workshop code? Enter it here!</p>
      <Input
        type="text"
        placeholder="Enter workshop code"
        ref={workshopCodeRef}
      />
      <Button variant="primary" onClick={onJoin} disabled={isJoining}>
        {isJoining ? 'Joining...' : 'Join Existing Workshop'}
      </Button>

      {joinedWorkshop && (
        <div className="workshop-result">
          <h2>Workshop Found!</h2>
          <p className="workshop-code">
            Code:{' '}
            <strong>
              {typeof joinedWorkshop.id === 'object'
                ? joinedWorkshop.id.value
                : joinedWorkshop.id}
            </strong>
          </p>
          <p>Name: {joinedWorkshop.name}</p>
          <p>Dollar Limit: ${joinedWorkshop.dollarLimit}</p>
          <p>Players: {joinedWorkshop.players.length}</p>

          <div className="form-field">
            <label>Select Your Player:</label>
            <Select
              value={selectedPlayer}
              onChange={(e) => onSelectPlayer(e.target.value)}
            >
              <option value="">Choose a player...</option>
              {joinedWorkshop.players.map((player: Player) => (
                <option key={player.nickname} value={player.nickname}>
                  {player.nickname}
                </option>
              ))}
            </Select>
            {selectedPlayer && (
              <p
                style={{
                  marginTop: '1rem',
                  color: '#165b33',
                  fontWeight: 600,
                }}
              >
                You selected: {selectedPlayer}
              </p>
            )}
          </div>
        </div>
      )}

      {joinError && (
        <div className="workshop-error">
          <p>{joinError}</p>
        </div>
      )}
    </div>
  )
}

export default JoinWorkshop
