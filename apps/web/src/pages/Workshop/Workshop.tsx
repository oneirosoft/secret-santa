import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import PlayerTable from '@/components/PlayerTable'
import PneumonicDisplay from '@/components/PneumonicDisplay'
import { createClient } from '@/api'
import './workshop.css'

const WorkshopPage = () => {
  const { pneumonic } = useParams<{ pneumonic: string }>()
  const client = createClient()

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
          <ul className='pairs-list'>
            {workshop.pairs.map((pair: any, index: number) => (
              <li key={index}>
                {pair[0].nickname} <span className='arrow'>→</span> {pair[1].nickname}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default WorkshopPage

