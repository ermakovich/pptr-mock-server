declare module 'pptr-mock-server' {
  import {Page, HTTPRequest} from 'puppeteer';

  type MockRequestFunction = (_: HTTPRequest) => Promise<void>;

  type ResponseBodyFunction = (
    _: HTTPRequest
  ) => ResponseBody | Promise<ResponseBody>;
  type ResponseBody =
    | Record<string, unknown>
    | ResponseBodyFunction
    | string
    | number
    | undefined;

  interface InitOptions {
    /**
     * Base api url. By default all requests matching
     * base api url are responded with 200 status and empty body, but you will see a
     * warning in output.
     */
    baseAppUrl?: string;
    /**
     * Base api url. By default all requests matching
     * base api url are responded with 200 status and empty body, but you will see a
     * warning in output.
     */
    baseApiUrl?: string;
    /**
     * Optional callback to be
     * executed for any unhandled request. By default requests are aborted if this
     * callback is not provided or returns falsy.
     */
    onRequest?: MockRequestFunction;

    /**
     * Optional callback to be
     * executed for any unhandled app request, i.e. request matching `baseAppUrl`
     * option. By default requests are continued if this callback is not provided or
     * returns falsy.
     */
    onAppRequest?: MockRequestFunction;

    /**
     * Optional callback to be
     * executed for any unhandled api request, i.e. request matching `baseApiUrl`
     * option. By default requests are responded with `200 OK {}` for convenience if
     * this callback is not provided or returns falsy.
     */
    onApiRequest?: MockRequestFunction;
  }

  interface ResponseOptions {
    // response body
    body?: ResponseBody;

    // delay response for N milliseconds
    delay?: number;

    // abort request with supplied error code
    abort?: string;

    // content type. Defaults to `application/json`.
    contentType?: string;
  }

  type MockRequestHandler = (
    _endpoint: string,
    _status: number,
    _response: ResponseOptions
  ) => MockRequest;

  /**
   * Class for registering mock responses. It's instance is returned by
   * `mockServer.init()`
   */
  export interface MockRequest {
    /**
     * Set expected mock response for request. There are also shortcuts `.get()`,
     * `.post()`, `.put()` and `.delete()` available
     * @method
     * @param {string} method request HTTP method
     * @param {string} endpoint request endpoint URL. If relative URL is passed,
     * it's considered as a request to api **relative** to baseApiUrl.
     * > checking for both `requestUrlStr` and `requestPath` allows to register
     * > both fully-qualified URLs if you need better control, or "short" versions
     * > with just path. Example: if you register handler as `http://foo`, it will
     * > be matched against both `http://foo` and `http://foo?query`. But if you
     * > register handler as `http://foo?query` it won't be matched against
     * > `http://foo`.
     * @param {number} status response status code
     * @param {ResponseOptions} response additional response options
     * @return {MockRequest}
     * @example <caption>Handle request to relative endpoint</caption>
     * const responseConfig = {body: {result: 'ok'}};
     * mockRequest.on('get', 'account', 200, responseConfig);
     * @example <caption>Using shortcut method and absolute url</caption>
     * const responseConfig = {body: {result: 'not found'}};
     * mockRequest.get('https://example.com/test', 404, responseConfig);
     * @example <caption>Simulate request timeout</caption>
     * mockRequest.post('search', null, {abort: 'timedout', delay: 10000});
     *
     */
    on(
      _method: string,
      _endpoint: string,
      _status: number,
      _response: ResponseOptions
    ): MockRequest;

    get: MockRequestHandler;
    post: MockRequestHandler;
    put: MockRequestHandler;
    delete: MockRequestHandler;
  }

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
  export function init(
    _page: Page,
    _options: InitOptions
  ): Promise<MockRequest>;
}
