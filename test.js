import puppeteer from 'puppeteer';

import mockServer from '.';

// TODO: add proper unit tests

(async function() {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  try {
    await mockServer.init(page);
  } finally {
    await browser.close();
  }
})();
