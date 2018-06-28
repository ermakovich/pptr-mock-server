import isNumber from 'lodash/fp/isNumber';

export default function(handlers, baseApiUrl, timeScaleFactor) {
  const handler = (method, endpoint, status, options = {}) => {
    if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      endpoint = baseApiUrl + endpoint;
    }

    if (isNumber(options.delay)) {
      options.delay *= timeScaleFactor;
    }

    handlers.push({method, endpoint, status, options});
  };

  const methods = ['get', 'post', 'put', 'delete'];

  methods.forEach(method => {
    this[method] = (endpoint, status, options) =>
      handler(method, endpoint, status, options);
  });
}
