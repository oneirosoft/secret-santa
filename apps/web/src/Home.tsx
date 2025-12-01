import { Button } from '@secret-santa/ui'
import './index.css'
import { useState } from 'react'

export function Home() {
  const [workshopCode, setWorkshopCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createdWorkshop, setCreatedWorkshop] = useState<any>(null)
  const [createError, setCreateError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [workshopName, setWorkshopName] = useState('')
  const [dollarLimit, setDollarLimit] = useState('50')
  const [playerInput, setPlayerInput] = useState('')
  const [players, setPlayers] = useState<string[]>([])

  const handleCreateWorkshop = async () => {
    if (!workshopName.trim()) {
      setCreateError('Please enter a workshop name')
      return
    }

    setIsCreating(true)
    setCreateError('')
    setCreatedWorkshop(null)
    try {
      const response = await fetch('http://localhost:3000/workshop/create', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workshopName,
          dollarLimit: parseInt(dollarLimit) || 50,
          players: players.map((nickname) => ({
            nickname,
            tags: [],
            wishlist: [],
          })),
        }),
      })

      if (response.ok) {
        const workshop = await response.json()
        setCreatedWorkshop(workshop)
        // Reset form
        setShowCreateForm(false)
        setWorkshopName('')
        setDollarLimit('50')
        setPlayers([])
      } else {
        const error = await response.json()
        console.error('Validation error:', error)
        setCreateError(`Failed to create workshop: ${JSON.stringify(error)}`)
      }
    } catch (error) {
      setCreateError('Error creating workshop. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const addPlayer = () => {
    if (playerInput.trim() && !players.includes(playerInput.trim())) {
      setPlayers([...players, playerInput.trim()])
      setPlayerInput('')
    }
  }

  const removePlayer = (nickname: string) => {
    setPlayers(players.filter((p) => p !== nickname))
  }

  return (
    <div className="app">
      <div className="snow" aria-hidden="true" />
      <h1>Secret Santa</h1>
      <p>Already have a workshop code? Enter it here!</p>
      <input
        type="text"
        placeholder="Enter workshop code"
        className="workshop-input"
        value={workshopCode}
        onChange={(e) => setWorkshopCode(e.target.value)}
      />
      <Button
        variant="primary"
        onClick={() => alert('Join workshop feature coming soon!')}
      >
        Join Existing Workshop
      </Button>
      <p>Or create a new workshop!</p>

      {!showCreateForm ? (
        <Button variant="primary" onClick={() => setShowCreateForm(true)}>
          Create New Workshop
        </Button>
      ) : (
        <div className="create-workshop-form">
          <div className="form-field">
            <label>Workshop Name:</label>
            <input
              type="text"
              placeholder="Enter workshop name"
              className="workshop-input"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Dollar Limit:</label>
            <input
              type="number"
              placeholder="50"
              className="workshop-input"
              value={dollarLimit}
              onChange={(e) => setDollarLimit(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Add Players:</label>
            <div className="player-input-row">
              <input
                type="text"
                placeholder="Enter player nickname"
                className="workshop-input"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <Button variant="secondary" onClick={addPlayer}>
                Add
              </Button>
            </div>
            {players.length > 0 && (
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
              onClick={handleCreateWorkshop}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Workshop'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateForm(false)
                setWorkshopName('')
                setDollarLimit('50')
                setPlayers([])
                setCreateError('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {createdWorkshop && (
        <div className="workshop-result">
          <h2>Workshop Created!</h2>
          <p className="workshop-code">
            Code:{' '}
            <strong>
              {typeof createdWorkshop.id === 'object'
                ? createdWorkshop.id.value
                : createdWorkshop.id}
            </strong>
          </p>
          <p>Name: {createdWorkshop.name}</p>
          <p>Dollar Limit: ${createdWorkshop.dollarLimit}</p>
          <p>Players: {createdWorkshop.players.length}</p>
        </div>
      )}

      {createError && (
        <div className="workshop-error">
          <p>{createError}</p>
        </div>
      )}
    </div>
  )
}

export default Home
