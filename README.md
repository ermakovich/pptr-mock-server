[![NPM downloads](https://img.shields.io/npm/dm/pptr-mock-server.svg?style=flat)](https://www.npmjs.com/package/pptr-mock-server)
[![CircleCI](https://circleci.com/gh/ermakovich/pptr-mock-server.svg?style=shield)](https://circleci.com/gh/ermakovich/pptr-mock-server)
[![Coverage Status](https://coveralls.io/repos/github/ermakovich/pptr-mock-server/badge.svg)](https://coveralls.io/github/ermakovich/pptr-mock-server)
[![dependencies Status](https://david-dm.org/ermakovich/pptr-mock-server/status.svg)](https://david-dm.org/ermakovich/pptr-mock-server)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server?ref=badge_shield)

# pptr-mock-server

Tiny library for backendless testing using [Puppeteer](https://pptr.dev/).

### Intro

This library allows to define mock backend responses when testing web app with
Puppeteer.

Internally it works purely via Puppeteer API using built-in
`setRequestInterception` mechanism. It doesn't set up any servers and doesn't
modify any window APIs like `XMLHttpRequest`. This provides great flexibility
and performance when handling requests, since it operates on browser internal
level.

NOTE: we use this library heavily in automated tests for Dock and related
projects, but api surface is minimalistic, so it may not fit your needs.
Contributions are welcome, so we can make this library more flexible and cover
more usage scenarios.

Recommended reading: [Automated UI Testing at Dock](https://medium.com/dock/automated-ui-testing-at-dock-d1c8f80eef66).

### Installing

```
yarn add -D pptr-mock-server
```

### Setting up

```JavaScript
import puppeteer from 'puppeteer';
import mockServer from 'pptr-mock-server';

// typically your global test setup
const browser = await puppeteer.launch();
const page = await browser.newPage();
const baseAppUrl = 'http://localhost';
const mockRequest = await mockServer.init(page, {
  baseAppUrl,
  baseApiUrl: baseAppUrl + '/api/'
});
```

### Basic usage

Once you have an instance of [MockRequest](api.md#mockrequest) you can pass it to your tests for registering mock responses:

```JavaScript
const responseConfig = {body: {result: 'ok'}};
mockRequest.on('GET', 'http://localhost/api/account', 200, responseConfig);
```

But since you provided `baseApiUrl` as http://localhost/api, you can use relative endpoint name. Also you can use `.get()` shorthand method instead of `.on()`:

```JavaScript
const responseConfig = {body: {result: 'ok'}};
mockRequest.get('account', 200, responseConfig);
```

When your app performs request to the specified resource, it will respond with
the mock response provided.

#### Mocking sequence of identical requests

Once you setup a mock request handler, every matching request will be responded with it. However it's a common scenario when you need to mock a sequence of requests, when over time the same request produces different results. Recommended way to do it is to replace previously registered mock response using new one:

```JavaScript
const responseConfig = {body: {result: 'ok'}};
mockRequest.get('account', 200, responseConfig); // returns 200 on each request
// test deleting account logic here
// after account is deleted we want to return 401 instead of 200
mockRequest.get('account', 401); // replaces existing handler
```

[Full api docs](api.md)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fermakovich%2Fpptr-mock-server?ref=badge_large)
