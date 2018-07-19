import handleRequest from './handle-request';
import sleep from './sleep';

const request = {
  url: jest.fn(),
  method: jest.fn(),
  respond: jest.fn(),
  abort: jest.fn(),
};

const baseAppUrl = 'http://localhost/';
const baseApiUrl = baseAppUrl + 'api/';
const endpoint = baseApiUrl + 'account';

const config = {baseAppUrl, baseApiUrl};

describe('handle request', () => {
  test('if there is request URL and method match', async () => {
    const status = 200;

    const handlers = [
      {
        method: 'get',
        endpoint,
        status,
        options: {},
      },
    ];

    request.url.mockReturnValueOnce(endpoint);
    request.method.mockReturnValueOnce('GET');

    const result = await handleRequest(request, config, handlers);

    expect(result).toBe(true);
    expect(request.respond).toHaveBeenCalledWith({
      status,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': baseAppUrl,
      },
    });
  });

  test('if there is request path and method match', async () => {
    const status = 200;

    const handlers = [
      {
        method: 'get',
        endpoint,
        status,
        options: {},
      },
    ];

    request.url.mockReturnValueOnce(endpoint + '?query');
    request.method.mockReturnValueOnce('GET');

    const result = await handleRequest(request, config, handlers);

    expect(result).toBe(true);
    expect(request.respond).toHaveBeenCalledWith({
      status,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': baseAppUrl,
      },
    });
  });

  test('by aborting it if abort option provided', async () => {
    const handlers = [
      {
        method: 'get',
        endpoint,
        options: {abort: true},
      },
    ];

    request.url.mockReturnValueOnce(endpoint);
    request.method.mockReturnValueOnce('GET');

    const result = await handleRequest(request, config, handlers);

    expect(result).toBe(true);
    expect(request.abort).toHaveBeenCalled();
  });

  test('with delay if delay option provided', async () => {
    const delay = 10;
    const handlers = [
      {
        method: 'get',
        endpoint,
        options: {delay},
      },
    ];

    request.url.mockReturnValueOnce(endpoint);
    request.method.mockReturnValueOnce('GET');

    const result = await handleRequest(request, config, handlers);
    await sleep(delay);

    expect(result).toBe(true);
    expect(request.abort).toHaveBeenCalled();
  });

  test('if there is no match, but endpoint starts with base api url', async () => {
    request.url.mockReturnValueOnce(endpoint);
    request.method.mockReturnValueOnce('GET');

    const result = await handleRequest(request, config);

    expect(result).toBe(true);
    expect(request.respond).toHaveBeenCalledWith({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
      headers: {
        'access-control-allow-origin': baseAppUrl,
        'access-control-allow-headers': 'Authorization, Content-Type',
      },
    });
  });
});

test('do not handle all other requests', async () => {
  request.url.mockReturnValueOnce('http://foo');
  request.method.mockReturnValueOnce('GET');

  const result = await handleRequest(request, config);

  expect(result).toBeUndefined();
});
