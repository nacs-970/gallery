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
  try {
    const prepared = prepareWithSegments(text, `${fontSize}px ${font}`, { letterSpacing })
    const { lines } = layoutWithLines(prepared, 1000, fontSize * lineHeight)
    
    return (
      <div style={{ fontFamily: font, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}>
        {lines.map((line, i) => (
          <div key={i}>{line.text}</div>
        ))}
      </div>
    )
  } catch (e) {
    // Fallback if Pretext fails (e.g. in environments without Intl.Segmenter)
    return (
      <div style={{ fontFamily: font, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}`, letterSpacing: letterSpacing ? `${letterSpacing}px` : 'normal' }}>
        {text}
      </div>
    )
  }
}

const FeaturedView = () => {
  const featuredImages = (galleryData as GalleryItem[]).filter(item => item.isFeatured)
  const displayImages = featuredImages.length > 0 ? featuredImages : (galleryData as GalleryItem[]).slice(0, 3)

  return (
    <div className="featured-view">
      {displayImages.map((image, index) => (
        <div key={image.id} className={`featured-item ${index % 2 === 0 ? 'align-left' : 'align-right'}`}>
          <div className="featured-image-wrapper">
            <img src={image.path} alt={image.displayName} className="featured-image" />
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
      ))}
    </div>
  )
}

export default FeaturedView
