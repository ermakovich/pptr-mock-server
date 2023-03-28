import first from 'lodash/fp/first'
import MockRequest from './mock-request'

let handlers

beforeEach(() => {
  handlers = []
})

test('support all methods and add handlers to array', () => {
  const mockRequest = new MockRequest(handlers)
  const methods = ['get', 'post', 'put', 'delete']
  methods.forEach((method) => {
    mockRequest[method]('account')
  })
  expect(handlers).toHaveLength(4)
})

test('add proper method for handler', () => {
  const mockRequest = new MockRequest(handlers)
  mockRequest.get('account')
  const handler = first(handlers)
  expect(handler.method).toBe('get')
})

test('prefix relative endpoint name with base api URL', () => {
  const baseApiUrl = 'api/'
  const mockRequest = new MockRequest(handlers, 'api/')
  const endpoint = 'account'
  mockRequest.get(endpoint)
  const handler = first(handlers)
  expect(handler.endpoint).toBe(baseApiUrl + endpoint)
})

test('allow absolute endpoint name starting with http://', () => {
  const mockRequest = new MockRequest(handlers)
  const endpoint = 'http://localhost/api/account'
  mockRequest.get(endpoint)
  const handler = first(handlers)
  expect(handler.endpoint).toBe(endpoint)
})

test('allow absolute endpoint name starting with https://', () => {
  const mockRequest = new MockRequest(handlers)
  const endpoint = 'http://localhost/api/account'
  mockRequest.get(endpoint)
  const handler = first(handlers)
  expect(handler.endpoint).toBe(endpoint)
})

test('add proper status for handler', () => {
  const mockRequest = new MockRequest(handlers)
  mockRequest.get('account', 200)
  const handler = first(handlers)
  expect(handler.status).toBe(200)
})

test('multiply delay by time scale factor', () => {
  const mockRequest = new MockRequest(handlers, null, 0.1)
  mockRequest.get('account', null, { delay: 100 })
  const handler = first(handlers)
  expect(handler.options.delay).toBe(10)
})
