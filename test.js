import puppeteer from 'puppeteer';

import mockServer from './src/index';

test('inits normally with Puppeteer', async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    await mockServer.init(page);
  } finally {
    await browser.close();
  }
});
