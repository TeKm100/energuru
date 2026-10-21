import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, 'dist');

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

// Sanitize Supabase URL if provided in environment
function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return trimmed.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
  }
}

const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
const supabasePublishableKey = (
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''
).trim();

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
};

function serveFile(res: http.ServerResponse, filePath: string, isSpaFallback = false): void {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (!isSpaFallback) {
        // Fallback to index.html for SPA
        serveFile(res, path.resolve(distPath, 'index.html'), true);
        return;
      }
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Cache-Control: immutable for hashed assets in /assets/, no-cache for index.html
    if (filePath.includes(`${path.sep}assets${path.sep}`)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    res.statusCode = 200;
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  // Defensive method check
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(reqUrl.pathname);

  // Health check endpoint for Cloud Run container probes
  if (pathname === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(
      JSON.stringify({
        status: 'ok',
        service: 'EnerGuru',
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // Runtime config endpoint
  if (pathname === '/api/config') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(
      JSON.stringify({
        supabaseUrl,
        supabasePublishableKey,
      })
    );
    return;
  }

  // Normalize requested path and prevent path traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let targetPath = path.join(distPath, safePath);

  // If path inside dist does not exist or points to a directory without index, fallback to SPA index.html
  fs.stat(targetPath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }

    // If file exists, serve it; otherwise serve SPA index.html
    fs.access(targetPath, fs.constants.F_OK, (accessErr) => {
      if (!accessErr && (!stats || stats.isFile() || path.extname(targetPath))) {
        serveFile(res, targetPath);
      } else {
        serveFile(res, path.resolve(distPath, 'index.html'), true);
      }
    });
  });
});

server.listen(port, host, () => {
  console.log(`EnerGuru production server listening on http://${host}:${port}`);
});

// Graceful shutdown on SIGTERM / SIGINT
function handleShutdown(signal: string) {
  console.log(`Received ${signal}, closing server...`);
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
  // Force close if still hanging after 5s
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
