const http = require('http');
const https = require('https');
const querystring = require('querystring');

const colors = { 2: 32, 3: 33, 4: 31, 5: 31 }; // colours 200-299 green, 300-399 yellow, and 400-599 red
const protocols = { http, https }; // uses HTTP or HTTPS depending on the protocols

/**
 * Make an asynchronous request to an HTTP or HTTPS address. Automatically
 * derives protocol from URL input, and content length from the request body.
 * @param {URL|String} url - The request URL.
 * @param {Object} opts - The request options.
 * @param {Object|String} body - The request body.
 * @returns {Promise} A promise to return either a response object, or an error.
 */
function request(url, opts, body = '') {
  const data = querystring.stringify(body); // stringifies the request body.

  const tick = new Date().getTime();
  return new Promise((resolve, reject) => {
    if (!(url instanceof URL)) {
      url = new URL(url); // coerces input into URL if not one already
    }
    const protocol = protocols[url.protocol?.slice(0, -1)]; // uses optional chain to avoid errors
    const request = protocol.request(url, { 'Content-Length': Buffer.byteLength(data), ...opts }, response => {
      const chunks = []; // creates an empty array to store response body

      response.on('data', chunk => {
        chunks.push(chunk); // adds data chunk to chunks array
      });

      response.on('end', () => {
        const tock = new Date().getTime();
        try {
          const message = chunks.join(''); // concatenates data chunks into a single string
          const { headers } = response;
          resolve({ message, headers });
        }
        catch (error) {
          reject(error);
        }
        finally {
          const color = `\x1b[${colors[response.statusCode.toString().charAt(0)] || 36}m`; // applies style changes
          const reset = '\x1b[0m'; // resets style changes
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
