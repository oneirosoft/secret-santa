import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import PlayerTable from '@/components/PlayerTable'
import PneumonicDisplay from '@/components/PneumonicDisplay'
import { createClient } from '@/api'
import './workshop.css'

const WorkshopPage = () => {
  const { pneumonic } = useParams<{ pneumonic: string }>()
  const client = createClient({ baseUrl: 'http://localhost:3001' })

  const { data: workshop, isLoading, error } = useQuery({
    queryKey: ['workshop', pneumonic],
    queryFn: async () => {
      if (!pneumonic) throw new Error('No pneumonic provided')
      const response = await client.workshop[pneumonic].get()
      return response.data
    },
    enabled: !!pneumonic,
  })

  if (isLoading) return <div>Loading workshop...</div>
  if (error) return <div>Error loading workshop</div>
  if (!workshop) return <div>Workshop not found</div>

  return (
    <div className='workshop'>
      <h1>{workshop.name}</h1>
      <PneumonicDisplay pneumonic={workshop.id} />
      <p>Dollar Limit: ${workshop.dollarLimit}</p>

      <h2>Players</h2>
      <PlayerTable players={workshop.players} readonly />

      {workshop.pairs.length > 0 && (
        <>
          <h2>Gift Pairs</h2>
          <div className='pairs'>
            {workshop.pairs.map((pair: any, index: number) => (
              <div key={index} className='pair'>
                <span>{pair[0].nickname}</span>
                <span>→</span>
                <span>{pair[1].nickname}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default WorkshopPage

