const http = require('http');
const url = require('url');

let dictionary = [];

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (req.method === 'GET') {
    // Handle GET requests
    if (pathname === '/api/definitions') {
      const word = query.word;
      const definition = dictionary.find(entry => entry.word === word);
      if (definition) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(definition));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Word '${word}' not found in the dictionary` }));
      }
    }
  } else if (req.method === 'POST') {
    // Handle POST requests
    if (pathname === '/api/definitions') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
      });
      req.on('end', () => {
        const { word, definition } = JSON.parse(body);
        if (typeof word === 'string' && typeof definition === 'string' && word.trim() !== '' && definition.trim() !== '') {
          const existingEntry = dictionary.find(entry => entry.word === word);
          if (existingEntry) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Warning! '${word}' already exists in the dictionary` }));
          } else {
            dictionary.push({ word, definition });
            const totalEntries = dictionary.length;
            const requestId = Math.floor(Math.random() * 1000); // Simulated request ID
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Request #${requestId}`, totalEntries }));
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid request body' }));
        }
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
