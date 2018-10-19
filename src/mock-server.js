import handleRequest from './handle-request';
import MockRequest from './mock-request';

/**
 * @class
 * @hideconstructor
 */
export default function MockServer() {
  /**
   * Init mock server and set request interception on the page
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
    const {
      baseApiUrl,
      baseAppUrl,
      onRequest,
      onAppRequest,
      onApiRequest,
      timeScaleFactor = 1,
    } = options;

    const handlers = [];
    await page.setRequestInterception(true);
    await page.on('request', request =>
      handleRequest(
        request,
        {baseAppUrl, baseApiUrl, onRequest, onAppRequest, onApiRequest},
        handlers
      )
    );

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
 * @property {function(PuppeteerRequest)} onRequest Optional callback to be
 * executed for any unhandled request. By default requests are aborted if this
 * callback is not provided or returns falsy.
 * @property {function(PuppeteerRequest)} onAppRequest Optional callback to be
 * executed for any unhandled app request, i.e. request matching `baseAppUrl`
 * option. By default requests are continued if this callback is not provided or
 * returns falsy.
 * @property {function(PuppeteerRequest)} onApiRequest Optional callback to be
 * executed for any unhandled api request, i.e. request matching `baseApiUrl`
 * option. By default requests are responded with `200 OK {}` for convenience if
 * this callback is not provided or returns falsy.
 */
