import galleryData from '../data/gallery.json'

interface ImageItem {
  id: string
  filename: string
  displayName: string
  isFeatured: boolean
  path: string
}

const GridView = () => {
  return (
    <div className="grid-view">
      {(galleryData as ImageItem[]).map((image) => (
        <div key={image.id} className="grid-item">
          <div className="grid-image-container">
            <img src={image.path} alt={image.displayName} className="grid-image" />
          </div>
          <div className="grid-label">{image.displayName}</div>
        </div>
      ))}
    </div>
  )
}

export default GridView
