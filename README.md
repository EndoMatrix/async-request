# @endom8rix/async-request
A lightweight, zero-dependency request wrapper to facilitate asynchronous requests.

## Setup
```shell
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

// POST request with a JSON object as the request body
await request('https://www.example.com/', { method: 'POST' }, { message: 'Hello World' });
```
A full list of options can be found on the respective [`http`](https://nodejs.org/api/http.html#http_http_request_url_options_callback) and [`https`](https://nodejs.org/api/https.html#https_https_request_url_options_callback) module pages.
