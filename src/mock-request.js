import isNumber from 'lodash/fp/isNumber'

/**
 * Class for registering mock responses. It's instance is returned by
 * `mockServer.init()`
 * @class
 * @hideconstructor
 */
export default function MockRequest(
  handlers,
  baseApiUrl = '',
  timeScaleFactor = 1
) {
  const handler = (method, endpoint, status, options = {}) => {
    if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      endpoint = baseApiUrl + endpoint
    }

    if (isNumber(options.delay)) {
      options.delay *= timeScaleFactor
    }

    handlers.push({ method, endpoint, status, options })
    return this
  }

  /**
   * Set expected mock response for request. There are also shortcuts `.get()`,
   * `.post()`, `.put()` and `.delete()` available
   * @method
   * @param {string} method request HTTP method
   * @param {string} endpoint request endpoint URL. If relative URL is passed,
   * it's considered as a request to api **relative** to baseApiUrl.
   * @param {number} status response status code
   * @param {ResponseOptions} response additional response options
   * @return {MockRequest}
   * @example <caption>Handle request to relative endpoint</caption>
   * const responseConfig = { body: { result: 'ok' } }
   * mockRequest.on('get', 'account', 200, responseConfig)
   * @example <caption>Using shortcut method and absolute url</caption>
   * const responseConfig = { body: { result: 'not found' } }
   * mockRequest.get('https://example.com/test', 404, responseConfig)
   * @example <caption>Simulate request timeout</caption>
   * mockRequest.post('search', null, { abort: 'timedout', delay: 10000 })
   */
  this.on = (method, endpoint, status, response) =>
    handler(method, endpoint, status, response)

  const methods = ['get', 'post', 'put', 'delete', 'patch']
  methods.forEach((method) => {
    this[method] = (endpoint, status, options) =>
      handler(method, endpoint, status, options)
  })
}

/**
 * @typedef {Object} ResponseOptions
 * @property {Object} body response body
 * @property {Promise|number=} delay delay response for N milliseconds or until promise is resolved
 * @property {string=} abort abort request with supplied error code
 * @property {string} [contentType] content type. Defaults to
 * `application/json`.
 */
