const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Add CORS headers for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Remove query strings from file path
    const urlPath = req.url.split('?')[0];
    filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
    
    const extname = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.otf': 'font/otf'
    };
    
    let contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Special handling for CSS files to ensure proper MIME type
    if (extname === '.css') {
        contentType = 'text/css; charset=utf-8';
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 Not Found</h1>
                    <p>The file <code>${req.url}</code> was not found.</p>
                    <p>Looking for: <code>${filePath}</code></p>
                `);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>500 Server Error</h1><p>${err.message}</p>`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Serving files from: ${__dirname}`);
});
