import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface GalleryItem {
  id: string;
  filename: string;
  displayName: string;
  isFeatured: boolean;
  path: string;
}

export default function galleryApiPlugin(): Plugin {
  return {
    name: 'gallery-api',
    configureServer(server) {
      server.middlewares.use((req, res, _next) => {
        if (req.url === '/api/save-metadata' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { id, displayName } = JSON.parse(body);
              const galleryPath = path.resolve(process.cwd(), 'src/data/gallery.json');
              const galleryData: GalleryItem[] = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
              
              const index = galleryData.findIndex(item => item.id === id);
              if (index !== -1) {
                galleryData[index].displayName = displayName;
                fs.writeFileSync(galleryPath, JSON.stringify(galleryData, null, 2));
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Image not found' }));
              }
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to update metadata' }));
            }
          });
        } else {
          _next();
        }
      });
    }
  };
}
