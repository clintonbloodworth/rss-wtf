const format = require("../library/format");
const getColor = require("../library/get-color");
const minify = require("../library/minify");
const parse = require("../library/parse");
const RssParser = require("rss-parser");
const sanitize = require("../library/sanitize");
const { v4: uuid } = require('uuid');
const { default: ow } = require("ow");

module.exports = async (request, response) => {
  response.setHeader("access-control-allow-origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

  try {
    ow(request.query.url, ow.string.not.empty);
  } catch (error) {
    response.status(400);
    response.send();
    return;
  }

  const parser = new RssParser({
    customFields: {
       item: ['content:encoded', 'description'],
    }
 });

  let feed;

  try {
    feed = await parser.parseURL(request.query.url);
  } catch {
    response.status(404);
    response.send();
    return;
  }

  if (!feed) {
    response.status(404);
    response.send();
    return;
  }

  if (request.query.limit) {
    feed.items = feed.items.slice(0, request.query.limit);
  }

  if (request.query.since) {
    feed.items = feed.items.filter(item => item.isoDate > request.query.since);
  }

  let articles;

  try {
    articles = feed.items
      .filter(item => item.content)
      .reduce((items, item) => {
        const isDuplicate = items.find((item$) => item$.link === item.link);

        if (!isDuplicate) {
          items.push(item);
        }

        return items;
      }, [])
      .map(item => {
        // Some feeds use `content:encoded` instead of `content`. The
        // parser by default only looks at `content` and falls back to
        // `description`. Falling back to `description` is fine. But
        // it should only happen when both `content` and `content:encoded``
        // are empty.
        if (item.content === item.description && item["content:encoded"]) {
          item.content = item["content:encoded"];
        }

        if (!request.query.no_parse) {
          const parsed = parse(item.content, item.link);
          item.content = parsed.content;
          item.title = item.title || parsed.title;
        }

        if (!request.query.no_format) {
          item.content = format(item.content, item.title, item.link);
        }

        if (!request.query.no_sanitize) {
          item.content = sanitize(item.content);
        }

        if (!request.query.no_minify) {
          item.content = minify(item.content);
        }

        const url = new URL(process.env.SELF_URL);
        url.pathname = "favicon";
        url.searchParams.set("url", feed.link);

        return {
          added: new Date().toISOString(),
          author: item.author,
          color: getColor(request.query.url),
          published: item.isoDate || new Date().toISOString(),
          favicon: url.toString(),
          feed: request.query.url,
          home: feed.link,
          html: item.content,
          id: uuid(),
          title: item.title || "Untitled",
          url: item.link,
        };
      })
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
    return;
  }

  response.setHeader(
    "cache-control",
    "s-maxage=300, stale-while-revalidate",
  );

  response.json(articles);
};
