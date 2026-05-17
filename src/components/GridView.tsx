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
  const [isSaving, setIsSaving] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  const handleEditClick = (image: ImageItem) => {
    if (isSaving) return
    setEditingId(image.id)
    setEditValue(image.displayName)
  }

  const handleSave = async (id: string) => {
    if (isSaving) return
    if (!editValue.trim()) {
      setEditingId(null)
      return
    }

    const originalImage = images.find(img => img.id === id)
    if (originalImage && originalImage.displayName === editValue) {
      setEditingId(null)
      return
    }

    setIsSaving(true)
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
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to save: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to save metadata:', error)
      alert('Failed to save metadata. Please check your connection.')
    } finally {
      setIsSaving(false)
      setEditingId(null)
    }
  }

  return (
    <div className="grid-view">
      {images.map((image) => (
        <div key={image.id} className="grid-item">
          <div className="grid-image-container" onClick={() => setExpandedImage(image.path)}>
            <img 
              src={image.path} 
              alt={image.displayName} 
              className="grid-image" 
              loading="lazy"
              style={{ cursor: 'zoom-in' }}
            />
          </div>
          <div className="grid-label">
            {editingId === image.id ? (
              <input
                autoFocus
                disabled={isSaving}
                className="grid-label-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(image.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave(image.id)}
              />
            ) : (
              <span 
                onClick={() => handleEditClick(image)}
                style={{ cursor: isSaving ? 'wait' : 'pointer' }}
                title="Click to edit"
              >
                {image.displayName}
              </span>
            )}
          </div>
        </div>
      ))}
      {expandedImage && (
        <div className="lightbox-overlay" onClick={() => setExpandedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={expandedImage} 
              alt={images.find(img => img.path === expandedImage)?.displayName || "Expanded Image"} 
            />
            <button 
              className="lightbox-close" 
              onClick={() => setExpandedImage(null)}
              aria-label="Close image"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GridView
