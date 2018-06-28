import isFunction from 'lodash/fp/isFunction';
import lowerCase from 'lodash/fp/lowerCase';
import findLast from 'lodash/fp/findLast';

const {URL} = require('url');

export default function handleRequest(
  request,
  {baseApiUrl, baseAppUrl},
  handlers
) {
  const requestUrlStr = request.url();
  const requestUrl = new URL(requestUrlStr);
  const requestPath = requestUrl.origin + requestUrl.pathname;

  const handler = findLast(handler => {
    const urlMatch =
      handler.endpoint === requestUrlStr || handler.endpoint === requestPath;
    return urlMatch && lowerCase(request.method()) === handler.method;
  })(handlers);

  if (handler) {
    const {status, options = {}} = handler;
    let {body} = options;
    body = isFunction(body) ? body(request) : body;

    setTimeout(() => {
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
    }, options.delay);

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
