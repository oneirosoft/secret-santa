import Button from '../../components/button/Button'
import Input, { Select } from '../../components/input/Input'
import './Home.styles.css'
import { useState } from 'react'
import config from 'app-config.json'

const Home = () => {
  const [workshopCode, setWorkshopCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [createdWorkshop, setCreatedWorkshop] = useState<any>(null)
  const [joinedWorkshop, setJoinedWorkshop] = useState<any>(null)
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [createError, setCreateError] = useState('')
  const [joinError, setJoinError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [workshopName, setWorkshopName] = useState('')
  const [dollarLimit, setDollarLimit] = useState('50')
  const [playerInput, setPlayerInput] = useState('')
  const [players, setPlayers] = useState<string[]>([])

  const apiUrl = config.api

  const handleCreateWorkshop = async () => {
    if (!workshopName.trim()) {
      setCreateError('Please enter a workshop name')
      return
    }

    setIsCreating(true)
    setCreateError('')
    setCreatedWorkshop(null)
    try {
      const response = await fetch(`${apiUrl}/workshop/create`, {
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

  const handleJoinWorkshop = async () => {
    if (!workshopCode.trim()) {
      setJoinError('Please enter a workshop code')
      return
    }

    setIsJoining(true)
    setJoinError('')
    setJoinedWorkshop(null)
    setSelectedPlayer('')
    try {
      const response = await fetch(`${apiUrl}/workshop/${workshopCode}`, {
        method: 'GET',
      })

      if (response.ok) {
        const workshop = await response.json()
        setJoinedWorkshop(workshop)
      } else {
        setJoinError('Workshop not found. Please check the code and try again.')
      }
    } catch (error) {
      setJoinError('Error joining workshop. Please try again.')
    } finally {
      setIsJoining(false)
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
    <>
      <h1>Secret Santa</h1>
      <p>Already have a workshop code? Enter it here!</p>
      <Input
        type="text"
        placeholder="Enter workshop code"
        value={workshopCode}
        onChange={(e) => setWorkshopCode(e.target.value)}
      />
      <Button
        variant="primary"
        onClick={handleJoinWorkshop}
        disabled={isJoining}
      >
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
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="">Choose a player...</option>
              {joinedWorkshop.players.map((player: any) => (
                <option key={player.nickname} value={player.nickname}>
                  {player.nickname}
                </option>
              ))}
            </Select>
            {selectedPlayer && (
              <p
                style={{ marginTop: '1rem', color: '#165b33', fontWeight: 600 }}
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

      <p>Or create a new workshop!</p>

      {!showCreateForm ? (
        <Button variant="primary" onClick={() => setShowCreateForm(true)}>
          Create New Workshop
        </Button>
      ) : (
        <div className="create-workshop-form">
          <div className="form-field">
            <label>Workshop Name:</label>
            <Input
              type="text"
              placeholder="Enter workshop name"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Dollar Limit:</label>
            <Input
              type="number"
              placeholder="50"
              value={dollarLimit}
              onChange={(e) => setDollarLimit(e.target.value)}
            />
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
    </>
  )
}

export default Home
