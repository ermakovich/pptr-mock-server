import handleRequest from './handle-request';
import MockRequest from './mock-request';

/**
 * @class
 * @hideconstructor
 */
export default function MockServer() {
  /**
   * Init mock server and set request interception on the page. All requests not
   * matching `baseAppUrl` and `baseApiUrl` and not handled using special
   * registered handler will be aborted and reported to console.
   * @param {Object} page Puppeteer's page
   * @param {InitOptions} options init options
   * @return {Promise<MockRequest>}
   * @example
   * import puppeteer from 'puppeteer';
   * import mockServer from 'pptr-mock-server';
   *
   * // typically your global test setup
   * const browser = await puppeteer.launch();
   * const page = await browser.newPage();
   * const baseAppUrl = 'http://localhost';
   * this.mockRequest = await mockServer.init(page, {
   *   baseAppUrl,
   *   baseApiUrl: baseAppUrl + '/api/'
   * });
   * // now you can use `this.mockRequest` in your tests
   */
  this.init = async (page, options = {}) => {
    const {baseApiUrl, baseAppUrl, timeScaleFactor = 1} = options;
    const handlers = [];
    await page.setRequestInterception(true);
    await page.on('request', async request => {
      if (!(await handleRequest(request, {baseApiUrl, baseAppUrl}, handlers))) {
        const requestUrlStr = request.url();
        if (requestUrlStr.startsWith(baseAppUrl)) {
          request.continue();
        } else {
          console.log(`${request.method()} ${requestUrlStr} aborted`);
          request.abort();
        }
      }
    });

    return new MockRequest(handlers, baseApiUrl, timeScaleFactor);
  };
}

/**
 * @typedef {Object} InitOptions
 * @property {string} baseAppUrl Base app url. By default all requests matching
 * base app url are continued.
 * @property {string} baseApiUrl Base api url. By default all requests matching
 * base api url are responded with 200 status and empty body, but you will see a
 * warning in output.
 */
