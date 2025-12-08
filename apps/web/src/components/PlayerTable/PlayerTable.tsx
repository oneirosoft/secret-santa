import { useRef } from 'react'
import Button from '@/components/Button'
import type { Player } from '@secret-santa/domain/player'
import './player-table.css'

interface PlayerTableProps {
  players: Pick<Player, 'nickname' | 'tags'>[]
  readonly?: boolean
  onAddPlayer?: (nickname: string, tags: string[]) => void
  onDeletePlayer?: (index: number) => void
}

const PlayerTable = ({
  players,
  readonly = false,
  onAddPlayer,
  onDeletePlayer,
}: PlayerTableProps) => {
  const nicknameRef = useRef<HTMLInputElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)

  const handleAddPlayer = () => {
    const nickname = nicknameRef.current?.value.trim() ?? ''
    const tags = tagsRef.current?.value.trim() ?? ''
    
    if (nickname && onAddPlayer) {
      onAddPlayer(nickname, tags.split(',').map(t => t.trim()).filter(Boolean))
      if (nicknameRef.current) nicknameRef.current.value = ''
      if (tagsRef.current) tagsRef.current.value = ''
      nicknameRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddPlayer()
    }
  }

  return (
    <table className='players-table'>
      <thead>
        <tr>
          <th>Nickname</th>
          <th>Tags</th>
          {!readonly && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {!readonly && (
          <tr className='input-row'>
            <td>
              <input 
                ref={nicknameRef}
                type="text"
                placeholder="Enter nickname"
                onKeyDown={handleKeyDown}
              />
            </td>
            <td>
              <input 
                ref={tagsRef}
                type="text"
                placeholder="comma separated"
                onKeyDown={handleKeyDown}
              />
            </td>
            <td>
              <Button onClick={handleAddPlayer}>Add</Button>
            </td>
          </tr>
        )}
        {players.map((player, index) => (
          <tr key={index}>
            <td>{player.nickname}</td>
            <td>{player.tags.join(', ')}</td>
            {!readonly && (
              <td>
                <Button variant="secondary" onClick={() => onDeletePlayer?.(index)}>Delete</Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PlayerTable
