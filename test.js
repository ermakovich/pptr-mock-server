import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

import mockServer from './src/index'

dotenv.config()

const executablePath = process.env.CHROME_PATH

test('inits normally with Puppeteer', async () => {
  const browser = await puppeteer.launch({
    executablePath,
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
