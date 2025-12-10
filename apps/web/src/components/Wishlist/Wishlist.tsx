import { useRef, useState } from 'react'
import type { WishlistItem } from '@secret-santa/domain/player'
import Input from '@/components/Input'
import Button from '@/components/Button'
import './wishlist.css'

type WishlistProps = {
  title: string
  items: WishlistItem[]
  mode: 'readonly' | 'mutable'
  onAddItem?: (item: WishlistItem) => void
  onDeleteItem?: (index: number) => void
}

const Wishlist = ({ title, items, mode, onAddItem, onDeleteItem }: WishlistProps) => {
  const itemNameRef = useRef<HTMLInputElement>(null)
  const itemUrlRef = useRef<HTMLInputElement>(null)

  const handleAddItem = () => {
    const name = itemNameRef.current?.value?.trim()
    const url = itemUrlRef.current?.value?.trim()

    if (!name) return

    onAddItem?.({
      name,
      url: url || undefined,
    })

    if (itemNameRef.current) itemNameRef.current.value = ''
    if (itemUrlRef.current) itemUrlRef.current.value = ''
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem()
    }
  }

  return (
    <div className='wishlist'>
      <h3>{title}</h3>
      
      {items.length === 0 ? (
        <div className='wishlist-empty'>
          {mode === 'readonly' ? 'No items yet' : 'Add your first wishlist item'}
        </div>
      ) : (
        <div className='wishlist-items'>
          {items.map((item, index) => (
            <div key={index} className='wishlist-item'>
              <div className='wishlist-item-content'>
                <div className='wishlist-item-name'>{item.name}</div>
                {item.url && (
                  <a
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='wishlist-item-url'
                  >
                    {item.url}
                  </a>
                )}
              </div>
              {mode === 'mutable' && (
                <button
                  className='wishlist-item-delete'
                  onClick={() => onDeleteItem?.(index)}
                  aria-label='Delete item'
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === 'mutable' && (
        <div className='wishlist-add-item'>
          <div className='wishlist-add-item-inputs'>
            <Input
              ref={itemNameRef}
              label='Item name'
              type='text'
              placeholder='Item name'
              onKeyPress={handleKeyPress}
            />
            <Input
              ref={itemUrlRef}
              label='URL (optional)'
              type='text'
              placeholder='URL (optional)'
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button onClick={handleAddItem}>Add Item</Button>
        </div>
      )}
    </div>
  )
}

export default Wishlist
