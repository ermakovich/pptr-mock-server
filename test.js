import puppeteer from 'puppeteer'

import mockServer from './src/index'

test('inits normally with Puppeteer', async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  try {
    const mockRequest = await mockServer.init(page, {
      baseAppUrl: '',
      baseApiUrl: '',
    })
    mockRequest.on('get', '/foo', 200, {})
    expect(true).toBeDefined()
  } finally {
    await browser.close()
  }
})
