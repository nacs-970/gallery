const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../images');
const dataDir = path.join(__dirname, '../src/data');
const output = path.join(dataDir, 'gallery.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const files = fs.readdirSync(imagesDir)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

const gallery = files.map(file => ({
  id: file,
  filename: file,
  displayName: file.replace(/\.[^/.]+$/, ""),
  isFeatured: false,
  path: `/images/${file}`
}));

fs.writeFileSync(output, JSON.stringify(gallery, null, 2));
console.log(`Synced ${files.length} images to ${output}`);
