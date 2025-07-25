[![NPM downloads](https://img.shields.io/npm/dm/pptr-mock-server.svg?style=flat)](https://www.npmjs.com/package/pptr-mock-server)
[![CI](https://github.com/ermakovich/pptr-mock-server/actions/workflows/node.js.yml/badge.svg)](https://github.com/ermakovich/pptr-mock-server/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/ermakovich/pptr-mock-server/badge.svg)](https://coveralls.io/github/ermakovich/pptr-mock-server)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://github.com/ermakovich/pptr-mock-server/issues/139)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server?ref=badge_shield)

# pptr-mock-server

Mocking server responses using [Puppeteer](https://pptr.dev/).

### Intro

This library allows to define mock backend responses when testing web app with
Puppeteer.

Internally it works purely via Puppeteer API using built-in
`setRequestInterception` mechanism. It doesn't set up any servers and doesn't
modify any window APIs like `XMLHttpRequest` or `fetch`. This provides great flexibility
and performance when handling requests, since it operates on browser internal
level.

Related reading: [Automated UI Testing at Dock](https://ermakovich.ru/posts/automated-ui-testing-at-dock/).

### Installing

```
npm install pptr-mock-server
```

### Setting up

```JavaScript
import puppeteer from 'puppeteer'
import mockServer from 'pptr-mock-server'

// typically your global test setup
const browser = await puppeteer.launch()
const page = await browser.newPage()
const baseAppUrl = 'http://localhost'
const mockRequest = await mockServer.init(page, {
  baseAppUrl,
  baseApiUrl: baseAppUrl + '/api/'
})
```

### Basic usage

Once you have an instance of a [MockRequest](docs/api.md#mockrequest) you can pass it to your tests for registering mock responses:

```JavaScript
const responseConfig = { body: { result: 'ok' } }
mockRequest.on('get', 'http://localhost/api/account', 200, responseConfig)
```

But since you provided `baseApiUrl` as http://localhost/api, you can use relative endpoint name. Also you can use `.get()` shorthand method instead of `.on()`:

```JavaScript
const responseConfig = { body: { result: 'ok' } }
mockRequest.get('account', 200, responseConfig)
```

When your app performs request to the specified resource, it will respond with
the mock response provided.

### Common scenarios

Handle request to relative endpoint using `.on` method:

```JavaScript
const responseConfig = { body: { result: 'ok' } }
mockRequest.on('get', 'account', 200, responseConfig)
```

Using shortcut `.get` method and absolute url:

```JavaScript
const responseConfig = { body: { result: 'not found' } }
mockRequest.get('https://example.com/test', 404, responseConfig)
```

Simulate request timeout:

```JavaScript
mockRequest.post('search', null, { abort: 'timedout', delay: 10000 })
```

### Mocking sequence of identical requests

Once you setup a mock request handler, every matching request will be responded with it. However it's a common scenario when you need to mock a sequence of requests, when over time the same request produces different results. Recommended way to do it is to replace previously registered mock response using new one:

```JavaScript
const responseConfig = { body: { result: 'ok' } }
mockRequest.get('account', 200, responseConfig) // returns 200 on each request
// test deleting account logic here
// after account is deleted we want to return 401 instead of 200
mockRequest.get('account', 401) // replaces existing handler
```

### [Full API reference 👉](docs/api.md)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server?ref=badge_large)
