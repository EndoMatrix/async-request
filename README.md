![npm](https://img.shields.io/npm/v/@endom8rix/async-request)

# @endom8rix/async-request
A lightweight, zero-dependency request wrapper to facilitate asynchronous requests.

## Setup
```SHELL
$ npm install @endom8rix/async-request
```

## Usage
```JS
const request = require('@endom8rix/async-request');

try {
  const response = await request('https://www.npmjs.com/');
  console.log(response.headers);
  console.log(response.body);
}
catch (error) {
  console.log(error);
}
```
This `async-request` module can handle both HTTP and HTTPS requests, and will automatically populate the `Content-Length` header to match the size of the request body.
```JS
// GET request using HTTP
await request('http://www.example.com/');

// GET request using HTTPS
await request('https://www.example.com/');

// GET request using a URL object
await request(new URL('https://www.example.com/'));

// POST request with an empty request body
await request('https://www.example.com/', { method: 'POST' });

// POST request with a String as the request body
await request('https://www.example.com/', { method: 'POST' }, 'Hello World');
```
Note that if the `Content-Type` header is not defined, the request body will be sent as-is. If you attempt to use a non-String or non-Buffer value, an error will occur.

Some MIME types are handled automatically:

```JS
// POST request with a JSON request body
await request('https://www.example.com/', { method: 'POST', headers: { 'Content-Type': 'application/json' } }, { say: 'Hello', to: 'World' });

// POST request with a URL-Encoded Form request body
await request('https://www.example.com/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, { say: 'Hello', to: 'World' });
```

A full list of options can be found on the respective [`http`](https://nodejs.org/api/http.html) and [`https`](https://nodejs.org/api/https.html) module pages.
