# pppt-mock-server

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

### Installing

```
yarn add -D pptr-mock-server
```

### Setting up

```JavaScript
import puppeteer from 'puppeteer';
import mockServer from 'pptr-mock-server';

const browser = await puppeteer.launch();
const page = await browser.newPage();
const baseAppUrl = 'http://localhost:8000';
this.mockServer = await mockServer.init(page, {
  baseAppUrl,
  baseApiUrl: baseAppUrl + '/api/'
});
```

### Basic usage

Once you have an instance of `mockServer` you can pass it to your test and add
expectations for particular api calls.

```JavaScript
const responseConfig = {body: {id}};
this.mockServer.get('account', 200, responseConfig);
```

When your app performs request to the specified resource, it will respond with
the mock response provided.
