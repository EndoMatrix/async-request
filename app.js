const http = require('http');
const https = require('https');
const qs = require('querystring');

const colors = { 2: 32, 3: 33, 4: 31, 5: 31 }; // colours 200-299 green, 300-399 yellow, and 400-599 red
const protocols = { http, https }; // uses HTTP or HTTPS depending on the protocols

/**
 * Parse a request body based on known MIME types, based on the Content-Type
 * header. If unknown or undefined, will return the original request body.
 * @param {Object} opts - The request options.
 * @param {Object|String} body - The request body.
 * @returns {Object|String} A parsed request body for known MIME types, or the original request body.
 */
function parse(opts = {}, body) {
  if (opts.headers == null) {
    return body; // terminates early if unable to retrieve MIME type
  }

  switch (opts.headers['Content-Type']) {
    case 'application/json': return JSON.stringify(body);
    case 'application/x-www-form-urlencoded': return qs.stringify(body);
    default: return body;
  }
}

/**
 * Make an asynchronous request to an HTTP or HTTPS address. Automatically
 * derives protocol from URL input, and content length from the request body.
 * @param {URL|String} url - The request URL.
 * @param {Object} opts - The request options.
 * @param {Object|String} body - The request body.
 * @returns {Promise} A promise to return either a response object, or an error.
 */
function request(url, opts = {}, body = '') {
  const data = parse(opts, body);

  if (opts.headers == null) {
    opts.headers = {};
  }

  if (opts.headers['Content-Length'] == null) {
    opts.headers['Content-Length'] = Buffer.byteLength(data);
  }

  return new Promise((resolve, reject) => {
    if (!(url instanceof URL)) {
      url = new URL(url); // coerces input into URL if not one already
    }
    const protocol = protocols[url.protocol.replace(/:$/, '')]; // removes trailing colon from URL protocol value
    const tick = new Date().getTime();
    const request = protocol.request(url, opts, response => {
      const chunks = []; // creates an empty array to store response body

      response.on('data', chunk => {
        chunks.push(chunk); // adds data chunk to chunks array
      });

      response.on('end', () => {
        const tock = new Date().getTime();
        try {
          const { headers } = response;
          const body = chunks.join(''); // concatenates data chunks into a single string
          resolve({ headers, body });
        }
        catch (error) {
          reject(error);
        }
        finally {
          const color = `\x1b[${colors[response.statusCode.toString().charAt(0)] || 36}m`; // applies style changes, defaults to blue
          const reset = '\x1b[0m'; // resets style changes
          console.debug(`${color}${request.method} ${url.protocol}//${url.host}${request.path} ${response.statusCode} ${tock - tick}ms${reset}`);
        }
      });

      response.on('error', error => {
        reject(error);
      });
    });

    request.write(data);
    request.end();
  });
}

module.exports = request;
