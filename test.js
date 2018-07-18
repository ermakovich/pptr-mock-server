import puppeteer from 'puppeteer';

import mockServer from '.';

test('inits normally with Puppeteer', async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  try {
    await mockServer.init(page);
  } finally {
    await browser.close();
  }
});
