import type { Plugin } from 'vite';
import fs from 'fs/promises';
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
      server.middlewares.use(async (req, res, _next) => {
        if (req.url?.startsWith('/images/')) {
          const url = new URL(req.url, 'http://localhost');
          const filePath = path.join(process.cwd(), url.pathname);
          try {
            const content = await fs.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.end(content);
            return;
          } catch {
            res.statusCode = 404;
            res.end();
            return;
          }
        }

        if (req.url === '/api/save-metadata' && req.method === 'POST') {
          let body = '';
          const MAX_BODY_SIZE = 1024 * 1024; // 1MB

          req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > MAX_BODY_SIZE) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'Payload too large' }));
              req.destroy();
            }
          });

          req.on('end', async () => {
            if (res.writableEnded) return;

            try {
              let parsedBody;
              try {
                parsedBody = JSON.parse(body);
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
              }

              const { id, displayName } = parsedBody;
              if (!id || typeof displayName !== 'string') {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing id or displayName' }));
                return;
              }

              const galleryPath = path.resolve(process.cwd(), 'src/data/gallery.json');
              const fileContent = await fs.readFile(galleryPath, 'utf-8');
              const galleryData: GalleryItem[] = JSON.parse(fileContent);
              
              const index = galleryData.findIndex(item => item.id === id);
              if (index !== -1) {
                galleryData[index].displayName = displayName;
                await fs.writeFile(galleryPath, JSON.stringify(galleryData, null, 2));
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Image not found' }));
              }
            } catch (error) {
              console.error('API Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
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
