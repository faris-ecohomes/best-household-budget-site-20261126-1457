// Hearth — tiny static server for local testing only.
//
// Serves app/ at http://localhost:8080 so the site can be opened in a
// browser and screenshotted. Not part of the entry; the site itself needs
// no server at all beyond any static host.
//
//   node serve.ts            (or: node serve.ts --port 8901)

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('app/', import.meta.url));
const port = Number(process.argv.find((a) => a.startsWith('--port='))?.split('=')[1] ?? 8080);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer(async (req, res) => {
  const path = normalize(join(appDir, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html'));
  if (!path.startsWith(appDir)) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});

server.listen(port, () => console.log('Hearth at http://localhost:' + port));
