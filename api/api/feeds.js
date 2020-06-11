const Logger = require('@docset/utilities/logger');
const got = require('got');
const ow = require('ow');
const Parser = require('rss-parser');
const scrape = require('../library/scrape');

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

  const urls = [];

  if (request.query.url.startsWith('http:')) {
    urls.push(request.query.url.replace('http:', 'https:'));
    urls.push(request.query.url);
  } else if (request.query.url.startsWith('https:')) {
    urls.push(request.query.url.replace('https:', 'http:'));
    urls.push(request.query.url);
  } else {
    const url$ = request.query.url.trim().replace(/^\/\//, '');
    urls.push(`http://${url$}`);
    urls.push(`https://${url$}`);
  }

  const response$ = await Promise
    .allSettled(urls.map(url => got(url)))
    .then(results => {
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(response => {
          return [
            'application/atom+xml',
            'application/rss+xml',
            'application/xml',
            'text/html',
            'text/xml',
          ].find(type => {
            return response.headers['content-type'].startsWith(type);
          });
        })
        .find((response, index, array) => {
          return index === array.length - 1
            ? true
            : response.url.startsWith('https');
        });
    });

  if (!response$ || !response$.body) {
    response.status(404);
    await log.info();
    response.send();
    return;
  }

  const isXml = [
    'application/atom+xml',
    'application/rss+xml',
    'application/xml',
    'text/xml',
  ].find(type => {
    return response$.headers['content-type'].startsWith(type);
  });

  let feeds;

  try {
    if (isXml) {
      const parser = new Parser();
      const feed = await parser.parseString(response$.body);
      feed.url = response$.url;
      feeds = [feed];
    } else {
      feeds = await scrape(response$.body, response$.url);
    }
  } catch (error) {
    response.status(500);
    await log.error(error);
    response.send();
    return;
  }

  if (!feeds.length) {
    response.status(404);
    await log.info();
    response.send();
    return;
  }

  feeds = feeds
    .map(feed => {
      const { hostname, origin } = new URL(feed.url);
      const url = new URL(process.env.SELF_URL);
      url.pathname = 'favicon';
      url.searchParams.set('url', origin);

      return {
        icon: url.toString(),
        items: {},
        title: feed.title.trim(),
        url: feed.url,
      };
    })
    .reduce((array, feed) => {
      return array.find(({ url }) => url === feed.url)
        ? array
        : array.concat(feed);
    }, []);

  response.setHeader(
    'cache-control',
    's-maxage=300, stale-while-revalidate',
  );

  response.json({
    feeds,
    isScraped: !isXml,
  });
};
