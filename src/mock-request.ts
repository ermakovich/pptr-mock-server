import { ResponseOptions, RequestHandler } from './handle-request'

/**
 * Class for registering mock responses. It's instance is returned by
 * `mockServer.init()`
 * @class
 * @hideconstructor
 */
export default class MockRequest {
  /** @private */
  private readonly handlers: RequestHandler[]
  /** @private */
  private readonly baseApiUrl: string

  constructor(handlers: RequestHandler[], baseApiUrl: string) {
    this.handlers = handlers
    this.baseApiUrl = baseApiUrl
  }

  /**
   * Set expected mock response for request. There are also shortcuts `.get()`,
   * `.post()`, `.put()`, `.delete()` and '.patch()` available
   * @method
   * @param {string} method request HTTP method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} [options] additional response options
   * @return {MockRequest}
   */
  on(
    method: string,
    endpoint: string,
    status: number,
    options: ResponseOptions
  ): MockRequest {
    if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      endpoint = this.baseApiUrl + endpoint
    }

    this.handlers.push({ method, endpoint, status, options })
    return this
  }
  /**
   * Shortcut for `.on('get', ...)`
   * @method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} [options] additional response options
   * @return {MockRequest}
   */
  get(endpoint: string, status: number, options: ResponseOptions): MockRequest {
    return this.on('get', endpoint, status, options)
  }
  /**
   * Shortcut for `.on('post', ...)`
   * @method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} [options] additional response options
   * @return {MockRequest}
   */
  post(
    endpoint: string,
    status: number,
    options: ResponseOptions
  ): MockRequest {
    return this.on('post', endpoint, status, options)
  }
  /**
   * Shortcut for `.on('put', ...)`
   * @method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} [options] additional response options
   * @return {MockRequest}
   */
  put(endpoint: string, status: number, options: ResponseOptions): MockRequest {
    return this.on('put', endpoint, status, options)
  }
  /**
   * Shortcut for `.on('delete', ...)`
   * @method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} [options] additional response options
   * @return {MockRequest}
   */
  delete(
    endpoint: string,
    status: number,
    options: ResponseOptions
  ): MockRequest {
    return this.on('delete', endpoint, status, options)
  }
  /**
   * Shortcut for `.on('patch', ...)`
   * @method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} [options] additional response options
   * @return {MockRequest}
   */
  patch(
    endpoint: string,
    status: number,
    options: ResponseOptions
  ): MockRequest {
    return this.on('patch', endpoint, status, options)
  }
}
