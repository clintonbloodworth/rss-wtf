const buildAbsoluteUrl = require('../../library/build-absolute-url');
const Parser = require('rss-parser');
const { JSDOM } = require("jsdom");

module.exports = async (html, url) => {
  const { document } = new JSDOM(html).window;

  document
    .querySelectorAll('link[type]')
    .forEach(element => {
      if (!element.type) {
        return;
      }

      element.type = element.type.toLowerCase();
    });

  const selectors = [
    'link[type="application/atom+xml"]',
    'link[type="application/rss+xml"]',
  ].join(',');

  const parser = new Parser();
  const promises = [];

  document
    .querySelectorAll(selectors)
    .forEach(element => {
      if (!element.href) {
        return;
      }

      const url$ = buildAbsoluteUrl(element.href, url);

      const promise = parser
        .parseURL(url$)
        .then(feed => {
          feed.url = url$;
          return feed;
        });

       promises.push(promise);
    });

  return Promise
    .allSettled(promises)
    .then(results => {
      return results
        .filter(result => result.status === "fulfilled")
        .map(result => result.value)
        .reduce((feeds, feed) => {
          return feeds
            .find(({ items, title }) => {
              const regex = /atom|rss/ig;

              if (regex.test(title) && regex.test(feed.title)) {
                title = title.replace(regex, "");
                feed.title = feed.title.replace(regex, "");
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
