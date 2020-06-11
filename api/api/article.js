const Logger = require('@docset/utilities/logger');
const minify = require('@docset/utilities/minify');
const sanitize = require('@docset/utilities/sanitize');
const ow = require('ow');
const format = require('../library/format');
const parse = require('../library/parse');
const proxy = require('../library/proxy');

// TODO: log parsing time
// TODO: return 400 if not URL

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
  } catch {
    response.status(400);
    await log.info();
    response.send();
    return;
  }

  let author;
  let headings;
  let html;
  let title;
  let url;

  try {
    ({ author, headings, html, title, url } = await parse(request.query.url));

    if (!request.query.no_sanitize) {
      html = sanitize(html);
      title = sanitize(`<unwhitelisted>${title}</unwhitelisted>`);
    }

    if (!request.query.no_format) {
      html = format(html, request.query.url);
    }

    if (!request.query.no_minify) {
      html = minify(html);
    }

    if (!request.query.no_proxy) {
      html = proxy(html);
    }
  } catch (error) {
    response.status(500);
    await log.error(error);
    response.send();
    return;
  }

  await log.info();
  response.setHeader('cache-control', 's-maxage=300, stale-while-revalidate');

  if (request.query.html) {
    response.json({
      author,
      title,
      url,
    });
  } else {
    const url$ = new URL(process.env.SELF_URL);
    url$.pathname = 'favicon';
    url$.searchParams.set('url', request.query.url);

    response.json({
      author,
      headings,
      html,
      title,
      url,
      icon: url$.toString(),
      languages: [],
      tags: ['article'],
      type: 'article',
    });
  }
};
