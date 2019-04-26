import handleRequest from './handle-request';

const request = {
  url: jest.fn(),
  method: jest.fn(),
  respond: jest.fn(),
  continue: jest.fn(),
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

    request.url.mockReturnValue(endpoint);
    request.method.mockReturnValue('GET');

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

    request.url.mockReturnValue(endpoint + '?query');
    request.method.mockReturnValue('GET');

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

    request.url.mockReturnValue(endpoint);
    request.method.mockReturnValue('GET');

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

    request.url.mockReturnValue(endpoint);
    request.method.mockReturnValue('GET');

    await handleRequest(request, config, handlers);

    expect(request.respond).toHaveBeenCalled();
  });

  test('if there is no match, but url starts with base api url', () => {
    request.url.mockReturnValue(endpoint);
    request.method.mockReturnValue('GET');

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

  test('if there is no match, but url starts with base app url', () => {
    request.url.mockReturnValue(baseAppUrl + 'foo');
    request.method.mockReturnValue('GET');

    handleRequest(request, config);

    expect(request.continue).toHaveBeenCalled();
  });

  test('if there is no match, but url is data: url', () => {
    request.url.mockReturnValue('data:image/png');
    request.method.mockReturnValue('GET');

    handleRequest(request, config);

    expect(request.continue).toHaveBeenCalled();
  });
});

test('abort all unhandled requests', () => {
  request.url.mockReturnValue('http://foo');
  request.method.mockReturnValue('GET');

  handleRequest(request, config);

  expect(request.abort).toHaveBeenCalled();
});
