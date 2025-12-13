import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import Input from '@/components/Input'
import PlayerTable from '@/components/PlayerTable'
import PneumonicDisplay from '@/components/PneumonicDisplay'
import { useToast } from '@/components/Toast'
import Pneumonic from '@secret-santa/domain/pneumonic'
import type { Player } from '@secret-santa/domain/player'
import './create-workshop.css'
import { createClient } from '@/api'

const CreateWorkshop = () => {
  const navigate = useNavigate()
  const pneumonic = useRef(Pneumonic.create(7))
  const [players, setPlayers] = useState<Pick<Player, 'nickname' | 'tags'>[]>([])
  const { showToast } = useToast()
  const workshopNameRef = useRef<HTMLInputElement>(null)

  const handleAddPlayer = (nickname: string, tags: string[]) => {
    setPlayers([...players, { nickname, tags }])
  }

  const handleDeletePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    const client = createClient()
    try {
      const response = await client.workshop.create.put({
        id: pneumonic.current,
        name: workshopNameRef.current?.value ?? '',
        dollarLimit: 50,
        players: players.map(p => ({
          nickname: p.nickname,
          tags: p.tags,
          wishlist: []
        })),
        pairs: []
      })
      console.log(response)
      if (response.error?.value.message)
        alert('An error occurred making the workshop')
      else
        navigate(`/${pneumonic.current.value}`)
    } catch (error) {
      showToast('An error occurred making the workshop')
    }
  }

  return (
    <div className='create-workshop'>
      <h1>Create Workshop</h1>
      <Input
        ref={workshopNameRef}
        label='Workshop Name'
        type='text'
        placeholder='Enter workshop name'
      />
      <div className='pneumonic-container'>
        <PneumonicDisplay pneumonic={pneumonic.current} />
      </div>
      <Button onClick={handleSave}>Create Workshop</Button>
      <PlayerTable
        players={players}
        onAddPlayer={handleAddPlayer}
        onDeletePlayer={handleDeletePlayer}
      />

    </div>
  )
}

export default CreateWorkshop
