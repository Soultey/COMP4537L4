const http = require('http');

/** Handles a 404 file not found error.
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function handle404(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('404 Not Found')
}

/** Handles a 500 internal server error.
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function handle500(req, res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' })
  res.end('Internal Server Error')
}

/** Returns the body of a request.
 * 
 * @param {http.IncomingMessage} req 
 * @returns {Promise<any>}
 */
async function getRequestBody(req) {
  // Asynchronously parse out the body.
  return new Promise((resolve, reject) => {
    let body = '';
    let parsedBody;

    if (!req) {
      reject('req is null'); s
    }

    if (req.method !== 'POST') {
      resolve(null);
      return;
    }

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
        return parsedBody;
      } catch (error) {
        reject('Error parsing json.');
        return null;
      }
    })
  });
}

module.exports = {
  handle404,
  handle500,
  getRequestBody
}
