import Button from '../../components/button/Button'
import JoinWorkshop from './JoinWorkshop'
import CreateWorkshopForm from './CreateWorkshop'
import { createWorkshop, getWorkshopByCode } from '../../api'
import { useRef, useState } from 'react'

const Home = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [createdWorkshop, setCreatedWorkshop] = useState<any>(null)
  const [joinedWorkshop, setJoinedWorkshop] = useState<any>(null)
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [createError, setCreateError] = useState('')
  const [joinError, setJoinError] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const workshopCodeRef = useRef<HTMLInputElement | null>(null)
  const workshopNameRef = useRef<HTMLInputElement | null>(null)
  const dollarLimitRef = useRef<HTMLInputElement | null>(null)

  const handleCreateWorkshop = async (players: string[]) => {
    const name = workshopNameRef.current?.value ?? ''
    const dollar = dollarLimitRef.current?.value ?? ''
    const dollarLimit = Number.isFinite(Number(dollar))
      ? Math.max(0, Number(dollar))
      : 50

    if (!name.trim()) {
      setCreateError('Please enter a workshop name')
      return
    }

    setIsCreating(true)
    setCreateError('')
    setCreatedWorkshop(null)
    try {
      const workshop = await createWorkshop({
        name,
        dollarLimit,
        players: players.map((nickname) => ({
          nickname,
          tags: [],
          wishlist: [],
        })),
      })

      setCreatedWorkshop(workshop)
      setShowCreateForm(false)
      if (workshopNameRef.current) workshopNameRef.current.value = ''
      if (dollarLimitRef.current) dollarLimitRef.current.value = '50'
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : 'Error creating workshop. Please try again.'
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinWorkshop = async () => {
    const code = workshopCodeRef.current?.value ?? ''

    if (!code.trim()) {
      setJoinError('Please enter a workshop code')
      return
    }

    setIsJoining(true)
    setJoinError('')
    setJoinedWorkshop(null)
    setSelectedPlayer('')
    try {
      const workshop = await getWorkshopByCode(code)
      setJoinedWorkshop(workshop)
    } catch (error) {
      setJoinError(
        error instanceof Error
          ? error.message
          : 'Error joining workshop. Please try again.'
      )
    } finally {
      setIsJoining(false)
    }
  }

  const handleCopyCode = async (code: string | number) => {
    const value = String(code)
    try {
      await navigator.clipboard.writeText(value)
      setCopyMessage('Copied!')
      setTimeout(() => setCopyMessage(''), 1500)
    } catch (error) {
      console.error('Failed to copy code', error)
      setCopyMessage('Copy failed')
      setTimeout(() => setCopyMessage(''), 1500)
    }
  }

  return (
    <>
      <h1>Secret Santa</h1>
      {!showCreateForm ? (
        <>
          <JoinWorkshop
            workshopCodeRef={workshopCodeRef}
            isJoining={isJoining}
            joinedWorkshop={joinedWorkshop}
            selectedPlayer={selectedPlayer}
            joinError={joinError}
            onJoin={handleJoinWorkshop}
            onSelectPlayer={setSelectedPlayer}
          />
          {!joinedWorkshop && (
            <>
              <p>Or create a new workshop!</p>

              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Create New Workshop
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          {!joinedWorkshop && (
            <CreateWorkshopForm
              workshopNameRef={workshopNameRef}
              dollarLimitRef={dollarLimitRef}
              isCreating={isCreating}
              createError={createError}
              onSubmit={handleCreateWorkshop}
              onCancel={() => {
                setShowCreateForm(false)
                if (workshopNameRef.current) workshopNameRef.current.value = ''
                if (dollarLimitRef.current) dollarLimitRef.current.value = '50'
                setCreateError('')
              }}
            />
          )}
        </>
      )}

      {!joinedWorkshop && createdWorkshop && (
        <div className="workshop-result">
          <h2>Workshop Created!</h2>
          <p className="workshop-code">
            <span
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Code:{' '}
              <strong>
                {typeof createdWorkshop.id === 'object'
                  ? createdWorkshop.id.value
                  : createdWorkshop.id}
              </strong>
              <Button
                variant="secondary"
                onClick={() =>
                  handleCopyCode(
                    typeof createdWorkshop.id === 'object'
                      ? createdWorkshop.id.value
                      : createdWorkshop.id
                  )
                }
              >
                Copy
              </Button>
              {copyMessage && <span>{copyMessage}</span>}
            </span>
          </p>
          <p>Name: {createdWorkshop.name}</p>
          <p>Dollar Limit: ${createdWorkshop.dollarLimit}</p>
          <p>Players: {createdWorkshop.players.length}</p>
        </div>
      )}
    </>
  )
}

export default Home
