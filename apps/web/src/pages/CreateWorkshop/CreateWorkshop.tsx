import { useState, useRef } from 'react'
import Button from '@/components/Button'
import { useToast } from '@/components/Toast'
import Pneumonic from '@secret-santa/domain/pneumonic'
import type { Player } from '@secret-santa/domain/player'
import './create-workshop.css'
import { setPageTitle } from '../documentTitle'

const CreateWorkshop = () => {
  const pneumonic = useRef(Pneumonic.create(7))
  const [players, setPlayers] = useState<Pick<Player, 'nickname' | 'tags'>[]>([])
  const { showToast } = useToast()
  const nicknameRef = useRef<HTMLInputElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)

  const handleAddPlayer = () => {
    const nickname = nicknameRef.current?.value.trim() ?? ''
    const tags = tagsRef.current?.value.trim() ?? ''
    
    if (nickname) {
      setPlayers([...players, { 
        nickname, 
        tags: new Set(tags.split(',').map(t => t.trim()).filter(Boolean))
      }])
      if (nicknameRef.current) nicknameRef.current.value = ''
      if (tagsRef.current) tagsRef.current.value = ''
      nicknameRef.current?.focus()
    }
  }

  const handleDeletePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const handleCopyPneumonic = async () => {
    if (pneumonic.current.value)
        await navigator.clipboard.writeText(pneumonic.current.value)
    showToast('Pneumonic copied to clipboard!')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddPlayer()
    }
  }

  return (
    <div className='create-workshop'>
      <h1>Create Workshop</h1>
      <div className='pneumonic-container'>
        <button className='pneumonic' onClick={handleCopyPneumonic} title='Click to copy'>
          {pneumonic.current.value}
        </button>
        <p className='pneumonic-help'>This is your workshop code. Click to copy.</p>
      </div>
      
      <table className='players-table'>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
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
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.nickname}</td>
              <td>{Array.from(player.tags).join(', ')}</td>
              <td>
                <Button variant="secondary" onClick={() => handleDeletePlayer(index)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CreateWorkshop
