import { Page } from 'puppeteer'

import handleRequest, { InitOptions, RequestHandler } from './handle-request'
import MockRequest from './mock-request'

/**
 * @class
 * @hideconstructor
 */
export default class MockServer {
  /**
   * Init mock server and set request interception on the page
   * @param {Page} page Puppeteer's page object
   * @param {InitOptions} options init options
   * @return {Promise<MockRequest>}
   */
  async init(page: Page, options: InitOptions): Promise<MockRequest> {
    const { baseApiUrl } = options

    const handlers: RequestHandler[] = []
    await page.setRequestInterception(true)
    page.on('request', (request) => handleRequest(request, options, handlers))

    return new MockRequest(handlers, baseApiUrl)
  }
}
