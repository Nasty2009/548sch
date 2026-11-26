const http = require('http');
const fs = require('fs');
const path = require('path');
const contact = require('./api/contact');
const assistant = require('./api/assistant');
const root = path.join(__dirname, 'site');
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 16384) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}
const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  if (requestUrl.pathname === '/api/contact') {
    try {
      req.body = await parseBody(req);
      return contact(req, res);
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: 'Invalid request body' }));
    }
  }
  if (requestUrl.pathname === '/api/assistant') {
    try {
      req.body = await parseBody(req);
      return assistant(req, res);
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: 'Invalid request body' }));
    }
  }
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.resolve(root, '.' + pathname);
  if (!filePath.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.stat(filePath, (error, stats) => {
    const candidate = !error && stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    fs.readFile(candidate, (readError, data) => {
      if (readError) {
        fs.readFile(path.join(root, '404.html'), (notFoundError, notFound) => {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(notFoundError ? 'Not found' : notFound);
        });
        return;
      }
      res.writeHead(200, {
        'Content-Type': mime[path.extname(candidate).toLowerCase()] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      });
      res.end(data);
    });
  });
});
server.listen(port, () => console.log('School 548 site: http://localhost:' + port));
