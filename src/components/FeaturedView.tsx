import { useState } from 'react'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'
import galleryData from '../data/gallery.json'

interface GalleryItem {
  id: string
  filename: string
  displayName: string
  isFeatured: boolean
  path: string
}

const PretextLabel = ({ text, font, fontSize, lineHeight, letterSpacing }: { 
  text: string, 
  font: string, 
  fontSize: number, 
  lineHeight: number,
  letterSpacing?: number
}) => {
  let lines: { text: string }[] | null = null

  try {
    const prepared = prepareWithSegments(text, `${fontSize}px ${font}`, { letterSpacing })
    const result = layoutWithLines(prepared, 1000, fontSize * lineHeight)
    lines = result.lines
  } catch {
    // Fallback if Pretext fails (e.g. in environments without Intl.Segmenter)
  }

  if (lines) {
    return (
      <div style={{ fontFamily: font, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}>
        {lines.map((line, i) => (
          <div key={i}>{line.text}</div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: font, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}`, letterSpacing: letterSpacing ? `${letterSpacing}px` : 'normal' }}>
      {text}
    </div>
  )
}

const FeaturedView = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const featuredImages = (galleryData as GalleryItem[]).filter(item => item.isFeatured)
  const displayImages = featuredImages.length > 0 ? featuredImages : (galleryData as GalleryItem[]).slice(0, 3)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const image = displayImages[currentIndex]

  return (
    <div className="featured-view">
      <div key={image.id} className="featured-item active">
        <div className="featured-image-wrapper">
          <img 
            src={image.path} 
            alt={image.displayName} 
            className="featured-image" 
            loading="lazy"
          />
          <div className="featured-caption">
            <div className="caption-title">
              <PretextLabel 
                text={image.displayName}
                font="Times New Roman"
                fontSize={48}
                lineHeight={1.2}
              />
            </div>
            <div className="caption-subtitle">
              <PretextLabel 
                text="FEATURED PROJECT"
                font="Arial"
                fontSize={12}
                lineHeight={1.5}
                letterSpacing={2}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Navigation functions available for next task */}
      <div style={{ display: 'none' }}>
        <button onClick={prevImage}>Prev</button>
        <button onClick={nextImage}>Next</button>
      </div>
    </div>
  )
}

export default FeaturedView
