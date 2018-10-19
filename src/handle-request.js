import isFunction from 'lodash/fp/isFunction';
import lowerCase from 'lodash/fp/lowerCase';
import findLast from 'lodash/fp/findLast';
import chalk from 'chalk';

import sleep from './sleep';

const {URL} = require('url');

const consolePrefix = `[${chalk.blue('pptr-mock-server')}]`;

function formatRequest(request) {
  return chalk.green(`${request.method()} ${request.url()}`);
}

function warn(message) {
  console.warn(`${consolePrefix} [warning] ${message}`);
}

export default async function handleRequest(
  request,
  {baseAppUrl, baseApiUrl, onRequest, onAppRequest, onApiRequest},
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
    return (
      urlMatch && lowerCase(request.method()) === lowerCase(handler.method)
    );
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
  } else if (requestUrlStr.startsWith(baseApiUrl)) {
    let apiRequestHandled;
    if (onApiRequest) {
      apiRequestHandled = onApiRequest(request);
    }
    if (!apiRequestHandled) {
      warn(
        `Unhandled api request! ${formatRequest(
          request
        )}. Responding with 200 OK {}.`
      );
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
        headers: {
          'access-control-allow-origin': baseAppUrl,
          'access-control-allow-headers': 'Authorization, Content-Type',
        },
      });
    }
    return true;
  } else if (requestUrlStr.startsWith(baseAppUrl)) {
    let appRequestHandled;
    if (onAppRequest) {
      appRequestHandled = onAppRequest(request);
    }
    if (!appRequestHandled) {
      request.continue();
    }
  } else {
    let requestHandled;
    if (onRequest) {
      requestHandled = onRequest(request);
    }
    if (!requestHandled) {
      warn(`Unhandled external request! ${formatRequest(request)}. Aborting.`);
      request.abort();
    }
  }
}
