const url = require('url');
const buildAbsoluteUrl = require('@docset/utilities/buildAbsoluteUrl');
const Logger = require('@docset/utilities/logger');
const cheerio = require('cheerio');
const ColorHash = require('color-hash');
const fileType = require('file-type');
const got = require('got');
const imageSize = require('image-size');
const isSvg = require('is-svg');
const ow = require('ow');

module.exports = async (request, response) => {
  response.setHeader('access-control-allow-origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

  const log = new Logger({
    request,
    response,
    host: 'rss',
    token: process.env.SCALYR_TOKEN,
  });

  try {
    ow(request.query.url, ow.string.not.empty);
  } catch (error) {
    response.status(400);
    await log.info();
    response.send();
    return;
  }

  let html;

  try {
    let secure;
    let insecure;

    if (request.query.url.startsWith('http:')) {
      secure = request.query.url.replace('http:', 'https:');
      insecure = request.query.url;
    } else if (request.query.url.startsWith('https:')) {
      secure = request.query.url;
      insecure = request.query.url.replace('https:', 'http:');
    } else {
      const url$ = request.query.url.trim().replace(/^\/\//, '');
      secure = `https://${url$}`;
      insecure = `http://${url$}`;
    }

    try {
      ({ body: html } = await got(secure));
      request.query.url = secure;
    } catch {
      ({ body: html } = await got(insecure));
      request.query.url = insecure;
    }
  } catch (error) {
    const { hostname } = url.parse(request.query.url);
    const color = new ColorHash(hostname).hex();
    // TODO: return image
    await log.error(error);
    response.json({ color });
    return;
  }

  let $;

  try {
    $ = cheerio.load(html);
  } catch (error) {
    const { hostname } = url.parse(request.query.url);
    const color = new ColorHash(hostname).hex();
    // TODO: return image
    await log.error(error);
    response.json({ color });
    return;
  }

  const [favicon] = await Promise.allSettled([
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    '/favicon.ico',
  ].flatMap(thing => {
    if (thing.startsWith('/')) {
      const url = buildAbsoluteUrl(request.query.url, thing);

      return got(url, { responseType: 'buffer' })
        .then(response => response.body);
    }

    return $(thing).map((_, element) => {
      const $element = $(element);
      const href = $element.attr('href');
      const url = buildAbsoluteUrl(request.query.url, href);

      return got(url, { responseType: 'buffer' })
        .then(response => response.body);
    }).get();
  })).then(async results => {
    const favicons = await Promise.all(results
      .filter(({ status }) => status === 'fulfilled')
      .map(async ({ value: buffer }) => {
        let height;
        let images;
        let type;
        let width;

        try {
          ({ height, images, width } = imageSize(buffer));

          // At the end of this, we need a mime type to pass along
          // as content-type. image-size doesn't return a mime type,
          // so fileType is used.
          type = isSvg(buffer.toString())
            ? 'image/svg+xml'
            : (await fileType.fromBuffer(buffer)).mime;
        } catch {
          return null;
        }

        const isValid = [
          'image/jpeg',
          'image/png',
          'image/svg+xml',
          'image/vnd.microsoft.icon',
          'image/x-icon',
        ].includes(type);

        if (!isValid) {
          return null;
        }

        // .ico
        if (images) {
          const [largest] = images.sort((first, second) => {
            return first.height >= second.height ? -1 : 1;
          });

          height = largest.height;
          width = largest.width;
        }

        if (height !== width || height < 32 || width < 32) {
          return null;
        }

        return {
          buffer,
          height,
          type,
          width,
        };
      }));

    return favicons.filter(result => Boolean(result))
      .sort((a, b) => (a.type === 'image/svg+xml' || a.height >= b.height ? -1 : 1));
  });

  const { hostname } = url.parse(request.query.url);
  const color = new ColorHash(hostname).hex();

  if (!favicon) {
    // TODO: return image
    response.json({ color });
    await log.info();
    return;
  }

  await log.info();
  response.setHeader('cache-control', 's-maxage=3600, stale-while-revalidate');
  response.setHeader('content-type', favicon.type);
  response.send(favicon.buffer);
};
