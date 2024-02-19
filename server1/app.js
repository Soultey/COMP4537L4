/**
 * <Used ChatGPT as a guide.>
 */

const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')
const { handle404 } = require('./labs/4/modules/utils')
const port = 4537;

// Create the server.
const server = http.createServer((req, res) => {
    try {

        // Parse the request URL
        const parsedUrl = url.parse(req.url, true)

        // Get the pathname from the URL
        let pathname = parsedUrl.pathname

        // Serve CSS files.
        if (pathname.endsWith('.css')) {
            serveFile(res, `${pathname}`, 'text/css')
            return;
        }

        // Serve JavaScript files.
        else if (pathname.endsWith('.js')) {
            serveFile(res, `${pathname}`, 'application/javascript')
            return;
        }

        // Serve JSON files.
        else if (pathname.endsWith('json')) {
            serveFile(res, `${pathname}`, 'text/json')
            return;
        }

        // Handle no path error.
        if (!pathname) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('404 Not Found')
            return
        }

        else if (pathname === '/labs/4/search') {
            serveFile(
                res,
                '/labs/4/search.html',
                'text/html'
            );
        }

        else if (pathname === '/labs/4/store') {
            serveFile(
                res,
                '/labs/4/store.html',
                'text/html'
            );
        }

        // Handle path not found.
        else {
            handle404(req, res)
        }
    } catch (error) {
        console.error(error);
    }
});

/**Serves a file to the connected user.
 *
 * @param {Response} res The server response.
 * @param {string} relativePath The relative path.
 * @param {string} contentType The type of content.
 */
function serveFile(res, relativePath, contentType) {
    try {
        // Join the file path.
        const filePath = path.join(__dirname, relativePath)

        // If the path does not exist, return an error.
        if (!fs.existsSync(filePath)) {
            // Handle file read error.
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Internal Server Error')
        }

        // Read the file.
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                // Handle file read error.
                res.writeHead(500, { 'Content-Type': 'text/plain' })
                res.end('Internal Server Error')
            } else {
                // Serve the file content
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(data)
            }
        });
    } catch (error) {
        console.error(error);
    }
}

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});