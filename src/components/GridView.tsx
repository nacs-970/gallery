import { useState, useEffect, useRef, useCallback } from 'react'
import galleryData from '../data/gallery.json'

interface ImageItem {
  id: string
  filename: string
  displayName: string
  isFeatured: boolean
  path: string
}

const SWIPE_THRESHOLD = 50

const GridView = ({ isExiting }: { isExiting?: boolean }) => {
  const [images, setImages] = useState<ImageItem[]>(galleryData as ImageItem[])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const dragStartRef = useRef<number | null>(null)

  const nextImage = useCallback(() => {
    if (!expandedImage) return
    const currentIndex = images.findIndex(img => img.path === expandedImage)
    const nextIndex = (currentIndex + 1) % images.length
    setExpandedImage(images[nextIndex].path)
  }, [expandedImage, images])

  const prevImage = useCallback(() => {
    if (!expandedImage) return
    const currentIndex = images.findIndex(img => img.path === expandedImage)
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setExpandedImage(images[prevIndex].path)
  }, [expandedImage, images])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!expandedImage) return
      if (e.key === 'Escape') {
        setExpandedImage(null)
      } else if (e.key === 'ArrowRight') {
        nextImage()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedImage, nextImage, prevImage])

  const handleDragStart = (x: number) => {
    dragStartRef.current = x
  }

  const handleDragEnd = (x: number) => {
    if (dragStartRef.current === null) return
    const deltaX = x - dragStartRef.current
    if (deltaX > SWIPE_THRESHOLD) prevImage()
    else if (deltaX < -SWIPE_THRESHOLD) nextImage()
    dragStartRef.current = null
  }

  const handleMouseLeave = () => {
    dragStartRef.current = null
  }

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
      {images.map((image, index) => (
        <div 
          key={image.id} 
          className={`grid-item ${isExiting ? 'exiting' : ''}`}
          style={{ 
            animationDelay: isExiting 
              ? `${(images.length - 1 - index) * 0.03}s` 
              : `${index * 0.03}s` 
          }}
        >
          <div className="grid-image-container" onClick={() => setExpandedImage(image.path)}>
            <img 
              src={image.path} 
              alt={image.displayName} 
              className="grid-image" 
              loading="lazy"
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={`grid-label ${editingId === image.id ? 'is-editing' : ''}`}>
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
        <div 
          className="lightbox-overlay" 
          onClick={() => setExpandedImage(null)}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseUp={(e) => handleDragEnd(e.clientX)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={expandedImage} 
              alt={images.find(img => img.path === expandedImage)?.displayName || "Expanded Image"} 
              draggable={false}
            />
            <button 
              className="lightbox-close" 
              onClick={() => setExpandedImage(null)}
              aria-label="Close image"
            >
              &times;
            </button>
          </div>
          <div className="nav-edge prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} />
          <div className="nav-edge next" onClick={(e) => { e.stopPropagation(); nextImage(); }} />
        </div>
      )}
    </div>
  )
}

export default GridView
