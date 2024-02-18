const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { handle404, getRequestBody } = require('./modules/utils');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Routing for static files
    if (pathname.startsWith('/COMP4537/labs/4/') && pathname.endsWith('.html')) {
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
        serveFile(res, fileName, 'text/html');
    } else if (pathname.startsWith('/COMP4537/labs/4/') && pathname.endsWith('.js')) {
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
        serveFile(res, fileName, 'text/javascript');
    } else {
        handle404(req, res);
    }
});

// Function to serve static files
function serveFile(res, fileName, contentType) {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
        handle404(req, res);
        return;
    }
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
