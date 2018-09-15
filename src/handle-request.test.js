import handleRequest from './handle-request';

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
  test('if there is request URL and method match', () => {
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

    handleRequest(request, config, handlers);

    expect(request.respond).toHaveBeenCalledWith({
      status,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': baseAppUrl,
      },
    });
  });

  test('if there is request path and method match', () => {
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

    handleRequest(request, config, handlers);

    expect(request.respond).toHaveBeenCalledWith({
      status,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': baseAppUrl,
      },
    });
  });

  test('by aborting it if abort option provided', () => {
    const handlers = [
      {
        method: 'get',
        endpoint,
        options: {abort: true},
      },
    ];

    request.url.mockReturnValueOnce(endpoint);
    request.method.mockReturnValueOnce('GET');

    handleRequest(request, config, handlers);

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

    await handleRequest(request, config, handlers);

    expect(request.respond).toHaveBeenCalled();
  });

  test('if there is no match, but endpoint starts with base api url', () => {
    request.url.mockReturnValueOnce(endpoint);
    request.method.mockReturnValueOnce('GET');

    handleRequest(request, config);

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

test('abort all unhandled requests', () => {
  request.url.mockReturnValueOnce('http://foo');
  request.method.mockReturnValueOnce('GET');

  handleRequest(request, config);

  expect(request.abort).toHaveBeenCalled();
});
