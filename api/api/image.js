const isTooLarge = require('@docset/utilities/isTooLarge');
const Logger = require('@docset/utilities/logger');
const got = require('got');
const ow = require('ow');

module.exports = async (request, response) => {
  response.setHeader(
    'access-control-allow-origin',
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  );

  const log = new Logger({
    request,
    response,
    host: 'rss',
    token: process.env.SCALYR_TOKEN,
  });

  try {
    ow(request.query.url, ow.string.not.empty);
  } catch {
    response.status(400);
    await log.info();
    response.send();
    return;
  }

  let response$;

  try {
    response$ = await got(request.query.url, { responseType: 'buffer' });
  } catch (error) {
    response.status(404);
    await log.error(error);
    response.send();
    return;
  }

  if (isTooLarge(response$.body)) {
    response.status(500);
    await log.info();
    response.send();
  } else if (response$.headers['content-type'].startsWith('image')) {
    response.setHeader('cache-control', 's-maxage=300, stale-while-revalidate');
    response.setHeader('content-type', response$.headers['content-type']);
    await log.info();
    response.send(response$.body);
  } else {
    response.status(404);
    await log.info();
    response.send();
  }
};
