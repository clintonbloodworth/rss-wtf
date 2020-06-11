// Imports
const buildAbsoluteUrl = require('@docset/utilities/buildAbsoluteUrl');
const cheerio = require('cheerio');
const Parser = require('rss-parser');

// Functions
async function parse(html, url) {
  const $ = cheerio.load(html);

  $('link[type]').each((_, element) => {
    const type = $(element).attr('type').toLowerCase();
    $(element).attr('type', type);
  });

  const selectors = [
    'link[type="application/atom+xml"]',
    'link[type="application/rss+xml"]',
  ].join(',');

  const parser = new Parser();

  const promises = $(selectors)
    .map((_, element) => {
      const href = $(element).attr('href');
      const url$ = buildAbsoluteUrl(url, href);

      return parser.parseURL(url$).then(feed => {
        feed.url = url$;
        return feed;
      });
    }).get();

  return Promise
    .allSettled(promises)
    .then(results => {
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .reduce((feeds, feed) => {
          return feeds
            .find(({ items, title }) => {
              const regex = /atom|rss/ig;

              if (regex.test(title) && regex.test(feed.title)) {
                title = title.replace(regex, '');
                feed.title = feed.title.replace(regex, '');
              }

              return title === feed.title && items.every((item, index) => {
                return [
                  feed.items[index] && feed.items[index].content === item.content,
                  feed.items[index] && feed.items[index].pubDate === item.pubDate,
                  feed.items[index] && feed.items[index].title === item.title,
                ].some(boolean => boolean);
              });
            }) ? feeds : feeds.concat(feed);
        }, []);
    });
}

// Exports
module.exports = parse;
