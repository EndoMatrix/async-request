const http = require('http');
const https = require('https');
const querystring = require('querystring');

const colors = { 2: 32, 3: 33, 4: 31, 5: 31 };
const protocols = { http, https };

function request(url, opts, body = '') {
  const data = querystring.stringify(body);

  const tick = new Date().getTime();
  return new Promise((resolve, reject) => {
    if (!(url instanceof URL)) {
      url = new URL(url);
    }
    const protocol = protocols[url.protocol?.slice(0, -1)];
    const request = protocol.request(url, { 'Content-Length': Buffer.byteLength(data), ...opts }, response => {
      let chunks = [];

      response.on('data', chunk => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const tock = new Date().getTime();
        try {
          const message = chunks.join('');
          const { headers } = response;
          resolve({ message, headers });
        }
        catch (error) {
          reject(error);
        }
        finally {
          const color = `\x1b[${colors[response.statusCode.toString().charAt(0)] || 36}m`;
          const reset = '\x1b[0m';
          console.debug(`${color}${request.method} ${request.protocol}//${request.host}${request.path} ${response.statusCode} ${tock - tick}ms${reset}`);
        }
      });

      response.on('error', (error) => {
        reject(error);
      });
    });

    request.write(data);
    request.end();
  });
}

module.exports = request;
