import isFunction from 'lodash/fp/isFunction'
import _ from 'lodash'
import chalk from 'chalk'
import { URL } from 'url'
import { HTTPRequest, ErrorCode } from 'puppeteer'

import sleep from './sleep'

/**
 * @typedef {Object} InitOptions
 * @property {string} baseAppUrl Base app url. By default all requests matching
 * base app url are continued.
 * @property {string} baseApiUrl Base api url. By default all requests matching
 * base api url are responded with 200 status and empty body, but you will see a
 * warning in output.
 * @property {function(HTTPRequest)} [onRequest] Optional callback to be
 * executed for any unhandled request. By default requests are aborted if this
 * callback is not provided or returns falsy.
 * @property {function(HTTPRequest)} [onAppRequest] Optional callback to be
 * executed for any unhandled app request, i.e. request matching `baseAppUrl`
 * option. By default requests are continued if this callback is not provided or
 * returns falsy.
 * @property {function(HTTPRequest)} [onApiRequest] Optional callback to be
 * executed for any unhandled api request, i.e. request matching `baseApiUrl`
 * option. By default requests are responded with `200 OK {}` for convenience if
 * this callback is not provided or returns falsy.
 */

export interface InitOptions {
  baseApiUrl: string
  baseAppUrl: string
  onRequest?: (request: HTTPRequest) => boolean
  onAppRequest?: (request: HTTPRequest) => boolean
  onApiRequest?: (request: HTTPRequest) => boolean
}

/**
 * @typedef {Object} ResponseOptions
 * @property {function(HTTPRequest):Object|Object} [body] response body
 * @property {Promise | number} [delay] delay response for N milliseconds or until promise is resolved
 * @property {string} [abort] abort request with supplied error code
 * @property {string} [contentType] content type. Defaults to
 * `application/json`.
 */

export interface ResponseOptions {
  body?: (request: HTTPRequest) => {} | {}
  abort?: ErrorCode
  delay?: Promise<any> | number
  contentType?: string
}

export interface RequestHandler {
  endpoint: string
  method: string
  status: number
  options: ResponseOptions
}

const consolePrefix = `[${chalk.blue('pptr-mock-server')}]`

function formatRequest(request: HTTPRequest) {
  return chalk.green(`${request.method()} ${request.url()}`)
}

function warn(message: string) {
  console.warn(`${consolePrefix} [warning] ${message}`)
}

export default async function handleRequest(
  request: HTTPRequest,
  {
    baseAppUrl,
    baseApiUrl,
    onRequest,
    onAppRequest,
    onApiRequest,
  }: InitOptions,
  handlers: RequestHandler[]
): Promise<void> {
  const requestUrlStr = request.url()
  const requestUrl = new URL(requestUrlStr)
  const requestPath = requestUrl.origin + requestUrl.pathname

  const handler = _.findLast(handlers, (handler) => {
    // checking for both `requestUrlStr` and `requestPath` allows to register
    // both fully-qualified URLs if you need better control, or "short" versions
    // with just path. Example: if you register handler as `http://foo`, it will
    // be matched against both `http://foo` and `http://foo?query`. But if you
    // register handler as `http://foo?query` it won't be matched against
    // `http://foo`.
    const urlMatch =
      handler.endpoint === requestUrlStr || handler.endpoint === requestPath
    return (
      urlMatch &&
      request.method().toLowerCase() === handler.method.toLowerCase()
    )
  })

  if (handler) {
    const { status, options } = handler
    const body = isFunction(options.body) ? options.body(request) : options.body

    const delay = options.delay
    if (delay) {
      await (_.isNumber(delay) ? sleep(delay) : delay)
    }

    if (options.abort) {
      request.abort(options.abort)
    } else {
      request.respond({
        status,
        contentType: options.contentType || 'application/json',
        body: JSON.stringify(body),
        headers: {
          'access-control-allow-origin': baseAppUrl,
        },
      })
    }
  } else if (requestUrlStr.startsWith(baseApiUrl)) {
    if (onApiRequest && onApiRequest(request)) {
      return
    }
    warn(
      `Unhandled api request! ${formatRequest(
        request
      )}. Responding with 200 OK {}.`
    )
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
      headers: {
        'access-control-allow-origin': baseAppUrl,
        'access-control-allow-headers': 'Authorization, Content-Type',
      },
    })
  } else if (
    requestUrlStr.startsWith(baseAppUrl) ||
    requestUrlStr.startsWith('data:')
  ) {
    if (onAppRequest && onAppRequest(request)) {
      return
    }
    request.continue()
  } else {
    if (onRequest && onRequest(request)) {
      return
    }
    warn(`Unhandled external request! ${formatRequest(request)}. Aborting.`)
    request.abort()
  }
}
