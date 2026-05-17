const fs = require('fs');
const path = require('path');

/**
 * Syncs the gallery.json data file with the contents of the images directory.
 * Preserves manually edited metadata (isFeatured, displayName) for existing images.
 * Removes entries for images no longer present in the directory.
 */
function syncImages() {
  try {
    const rootDir = process.cwd();
    const imagesDir = path.resolve(rootDir, 'images');
    const dataDir = path.resolve(rootDir, 'src/data');
    const outputFile = path.join(dataDir, 'gallery.json');

    if (!fs.existsSync(imagesDir)) {
      console.error(`Error: Images directory not found at ${imagesDir}`);
      process.exit(1);
    }

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read current physical files
    const files = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file));

    // Load existing metadata if available
    let existingGallery = [];
    if (fs.existsSync(outputFile)) {
      try {
        const content = fs.readFileSync(outputFile, 'utf8');
        existingGallery = JSON.parse(content);
      } catch (err) {
        console.warn('Warning: Could not parse existing gallery.json. Starting fresh.');
      }
    }

    // Map existing data for quick lookup
    const existingMap = new Map(existingGallery.map(item => [item.filename, item]));

    // Build new gallery data
    const newGallery = files.map(file => {
      const existing = existingMap.get(file);
      
      return {
        id: file,
        filename: file,
        displayName: existing?.displayName || file.replace(/\.[^/.]+$/, ""),
        isFeatured: existing?.isFeatured ?? false,
        path: `/images/${file}`
      };
    });

    fs.writeFileSync(outputFile, JSON.stringify(newGallery, null, 2));
    console.log(`Successfully synced ${newGallery.length} images to ${outputFile}`);
  } catch (error) {
    console.error('Failed to sync images:', error.message);
    process.exit(1);
  }
}

syncImages();
