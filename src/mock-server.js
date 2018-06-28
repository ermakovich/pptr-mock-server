import handleRequest from './handle-request';
import AddHandler from './add-handler';

export default function() {
  this.init = async (
    page,
    {baseApiUrl, baseAppUrl, timeScaleFactor = 1} = {}
  ) => {
    const handlers = [];
    await page.setRequestInterception(true);
    await page.on('request', request => {
      if (!handleRequest(request, {baseApiUrl, baseAppUrl}, handlers)) {
        const requestUrlStr = request.url();
        if (requestUrlStr.startsWith(baseAppUrl)) {
          request.continue();
        } else {
          console.log(`${request.method()} ${requestUrlStr} aborted`);
          request.abort();
        }
      }
    });

    return new AddHandler(handlers, baseApiUrl, timeScaleFactor);
  };
}
