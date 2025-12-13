import { useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { WishlistItem } from '@secret-santa/domain/player'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Wishlist from '@/components/Wishlist'
import { useToast } from '@/components/Toast'
import { createClient } from '@/api'
import './player.css'

const PlayerPage = () => {
  const { pneumonic } = useParams<{ pneumonic: string, nickname?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const nicknameParam = searchParams.get('nickname')
  const [nickname, setNickname] = useState<string | null>(nicknameParam)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const client = createClient()
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const { data: playerPair, isLoading, error, refetch } = useQuery({
    queryKey: ['playerPair', pneumonic, nickname],
    queryFn: async () => {
      if (!pneumonic || !nickname) throw new Error('Missing pneumonic or nickname')
      const response = await (client.workshop as any)[pneumonic].player[nickname].get()
      return response.data
    },
    enabled: !!pneumonic && !!nickname,
  })

  const updateWishlistMutation = useMutation({
    mutationFn: async (wishlist: WishlistItem[]) => {
      if (!pneumonic || !nickname) throw new Error('Missing pneumonic or nickname')
      const response = await (client.workshop as any)[pneumonic].player[nickname]['update-wishlist'].patch(
        wishlist
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerPair', pneumonic, nickname] })
      showToast('Wishlist updated successfully!')
    },
    onError: () => {
      showToast('Failed to update wishlist')
    },
  })

  const handleNicknameSubmit = () => {
    const value = nicknameRef.current?.value?.trim()
    if (value) {
      setSearchParams({
        nickname: value
      })
      setNickname(value)
    }
  }

  const handleAddItem = (item: WishlistItem) => {
    if (!playerPair) return
    const newWishlist = [...playerPair.giver.wishlist, item]
    updateWishlistMutation.mutate(newWishlist)
  }

  const handleDeleteItem = (index: number) => {
    if (!playerPair) return
    const newWishlist = playerPair.giver.wishlist.filter((_: WishlistItem, i: number) => i !== index)
    updateWishlistMutation.mutate(newWishlist)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNicknameSubmit()
    }
  }

  const handleRefresh = () => {
    if (timeoutRef.current)
      clearTimeout(timeoutRef.current)

    setTimeout(refetch, 250)
  }

  if (!nickname) {
    return (
      <div className='player'>
        <h1>Enter Your Nickname</h1>
        <div className='player-nickname-input'>
          <Input
            ref={nicknameRef}
            label='Nickname'
            type='text'
            placeholder='Enter your nickname'
            onKeyPress={handleKeyPress}
            fullWidth
          />
          <Button onClick={handleNicknameSubmit}>Continue</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='player'>
        <div className='player-loading'>Loading your wishlists...</div>
      </div>
    )
  }

  if (error || !playerPair) {
    return (
      <div className='player'>
        <div className='player-error'>
          {error ? 'Error loading player data. Please check your nickname.' : 'Player not found.'}
        </div>
        <Button onClick={() => setNickname(null)}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className='player'>
      <h1>Welcome, {playerPair.giver.nickname}!</h1>
      <Button onClick={handleRefresh}>Refresh</Button>
      <div className='player-wishlists'>
        {playerPair.receiver ? (
          <Wishlist
            title={`${playerPair.receiver.nickname}'s Wishlist`}
            items={playerPair.receiver.wishlist}
            mode='readonly'
          />
        ) : (
          <div className='wishlist'>
            <h3>Your Recipient</h3>
            <div className='wishlist-empty'>
              Pairs have not been made yet. Check back later!
            </div>
          </div>
        )}

        <Wishlist
          title='Your Wishlist'
          items={playerPair.giver.wishlist}
          mode='mutable'
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
        />
      </div>
    </div>
  )
}

export default PlayerPage
