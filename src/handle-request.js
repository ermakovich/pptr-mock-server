import isFunction from 'lodash/fp/isFunction';
import lowerCase from 'lodash/fp/lowerCase';
import findLast from 'lodash/fp/findLast';

import sleep from './sleep';

const {URL} = require('url');

export default async function handleRequest(
  request,
  {baseApiUrl, baseAppUrl},
  handlers
) {
  const requestUrlStr = request.url();
  const requestUrl = new URL(requestUrlStr);
  const requestPath = requestUrl.origin + requestUrl.pathname;

  const handler = findLast(handler => {
    // checking for both `requestUrlStr` and `requestPath` allows to register
    // both fully-qualified URLs if you need better control, or "short" versions
    // with just path. Example: if you register handler as `http://foo`, it will
    // be matched against both `http://foo` and `http://foo?query`. But if you
    // register handler as `http://foo?query` it won't be matched against
    // `http://foo`.
    const urlMatch =
      handler.endpoint === requestUrlStr || handler.endpoint === requestPath;
    return urlMatch && lowerCase(request.method()) === handler.method;
  })(handlers);

  if (handler) {
    const {status, options} = handler;
    let {body} = options;
    body = isFunction(body) ? body(request) : body;

    if (options.delay) {
      await sleep(options.delay);
    }

    if (options.abort) {
      request.abort(options.abort);
    } else {
      request.respond({
        status,
        contentType: options.contentType || 'application/json',
        body: JSON.stringify(body),
        headers: {
          'access-control-allow-origin': baseAppUrl,
        },
      });
    }

    return true;
  } else if (requestUrlStr.startsWith(baseApiUrl)) {
    console.warn(`Unexpected api call! ${request.method()} ${requestUrlStr}`);
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
      headers: {
        'access-control-allow-origin': baseAppUrl,
        'access-control-allow-headers': 'Authorization, Content-Type',
      },
    });
    return true;
  }
}
