const headings = require('@docset/utilities/headings');
const Logger = require('@docset/utilities/logger');
const sanitize = require('@docset/utilities/sanitize');
const cheerio = require('cheerio');
const original = require('original');
const ow = require('ow');
const RssParser = require('rss-parser');
const format = require('../library/format');
const parse = require('../library/parse');
const proxy = require('../library/proxy');

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

  const parser = new RssParser();
  let feed;

  try {
    feed = await parser.parseURL(request.query.url);
  } catch {
    response.status(404);
    await log.info();
    response.send();
    return;
  }

  if (!feed) {
    response.status(404);
    await log.info();
    response.send();
    return;
  }

  if (request.query.limit) {
    feed.items = feed.items.slice(0, request.query.limit);
  }

  if (request.query.since) {
    feed.items = feed.items.filter(item => item.isoDate > request.query.since);
  }

  let items;

  try {
    items = await Promise.all(
      feed.items.map(async item => {
        const isMaybeArticleLink = original.same(feed.link, item.link);

        if (isMaybeArticleLink) {
          try {
            const { html } = await parse(item.link);
            item.content = html;
          } catch {}
        }

        if (!request.query.no_sanitize) {
          item.content = sanitize(item.content);
        }

        if (!request.query.no_format) {
          item.content = format(item.content);
        }

        if (!request.query.no_minify) {
          item.content = format(item.content);
        }

        if (!request.query.no_proxy) {
          item.content = proxy(item.content);
        }

        const $ = cheerio.load(item.content);
        const $h1s = $('h1');
        // TODO: sanitze.
        // TODO: dedupe feeds.

        if (!$h1s.length && item.title) {
          const h1 = `<h1><a href="${item.link}">${item.title}</a></h1>`;
          $('article').prepend(h1);
        }

        // TODO: Combine with one form feeds.get.js and put into library.
        const url = new URL(process.env.SELF_URL);
        url.pathname = 'favicon';
        url.searchParams.set('url', request.query.url);

        return {
          author: item.author,
          date: item.isoDate, // TODO: date is optionaL. what to do?
          html: $('body').html(),
          title: item.title,
          url: item.link, // TODO: optional. what to do?
        };
      }),
    );
  } catch (error) {
    response.status(500);
    await log.error(error);
    response.send();
    return;
  }

  items = items.reduce((object, item) => {
    object[item.url] = item;
    return object;
  }, {});

  response.setHeader(
    'cache-control',
    's-maxage=300, stale-while-revalidate',
  );

  response.json(items);
};
