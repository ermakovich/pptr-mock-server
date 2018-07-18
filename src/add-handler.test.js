import first from 'lodash/fp/first';
import AddHandler from './add-handler';

let handlers;

beforeEach(() => {
  handlers = [];
});

test('support all methods and add handlers to array', () => {
  const addHandler = new AddHandler(handlers);
  const methods = ['get', 'post', 'put', 'delete'];
  methods.forEach(method => {
    addHandler[method]('account');
  });
  expect(handlers).toHaveLength(4);
});

test('add proper method for handler', () => {
  const addHandler = new AddHandler(handlers);
  addHandler.get('account');
  const handler = first(handlers);
  expect(handler.method).toBe('get');
});

test('prefix relative endpoint name with base api URL', () => {
  const baseApiUrl = 'api/';
  const addHandler = new AddHandler(handlers, 'api/');
  const endpoint = 'account';
  addHandler.get(endpoint);
  const handler = first(handlers);
  expect(handler.endpoint).toBe(baseApiUrl + endpoint);
});

test('allow absolute endpoint name starting with http://', () => {
  const addHandler = new AddHandler(handlers);
  const endpoint = 'http://localhost/api/account';
  addHandler.get(endpoint);
  const handler = first(handlers);
  expect(handler.endpoint).toBe(endpoint);
});

test('allow absolute endpoint name starting with https://', () => {
  const addHandler = new AddHandler(handlers);
  const endpoint = 'http://localhost/api/account';
  addHandler.get(endpoint);
  const handler = first(handlers);
  expect(handler.endpoint).toBe(endpoint);
});

test('add proper status for handler', () => {
  const addHandler = new AddHandler(handlers);
  addHandler.get('account', 200);
  const handler = first(handlers);
  expect(handler.status).toBe(200);
});

test('multiply delay by time scale factor', () => {
  const addHandler = new AddHandler(handlers, null, 0.1);
  addHandler.get('account', null, {delay: 100});
  const handler = first(handlers);
  expect(handler.options.delay).toBe(10);
});
