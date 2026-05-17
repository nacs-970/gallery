import { useState } from 'react'
import galleryData from '../data/gallery.json'

interface ImageItem {
  id: string
  filename: string
  displayName: string
  isFeatured: boolean
  path: string
}

const GridView = () => {
  const [images, setImages] = useState<ImageItem[]>(galleryData as ImageItem[])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleEditClick = (image: ImageItem) => {
    setEditingId(image.id)
    setEditValue(image.displayName)
  }

  const handleSave = async (id: string) => {
    if (!editValue.trim()) {
      setEditingId(null)
      return
    }

    try {
      const response = await fetch('/api/save-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, displayName: editValue }),
      })

      if (response.ok) {
        setImages(prev =>
          prev.map(img => (img.id === id ? { ...img, displayName: editValue } : img))
        )
      }
    } catch (error) {
      console.error('Failed to save metadata:', error)
    } finally {
      setEditingId(null)
    }
  }

  return (
    <div className="grid-view">
      {images.map((image) => (
        <div key={image.id} className="grid-item">
          <div className="grid-image-container">
            <img src={image.path} alt={image.displayName} className="grid-image" />
          </div>
          <div className="grid-label">
            {editingId === image.id ? (
              <input
                autoFocus
                className="grid-label-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(image.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave(image.id)}
              />
            ) : (
              <span onClick={() => handleEditClick(image)}>{image.displayName}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GridView
