const got = require("got");
const Parser = require("rss-parser");
const sanitize = require("../../library/sanitize");
const scrape = require("./scrape");
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

  const urls = [];

  if (request.query.url.startsWith("http")) {
    urls.push(request.query.url)
  } else {
    const url$ = request.query.url.trim().replace(/^\/\//, "");
    urls.push(`http://${url$}`);
    urls.push(`https://${url$}`);
  }

  const requests = urls.map(url => got(url));

  const response$ = await Promise
    .allSettled(requests)
    .then(results => {
      return results
        .filter(result => result.status === "fulfilled")
        .map(result => result.value)
        .filter(response => {
          return [
            "application/atom+xml",
            "application/rss+xml",
            "application/xml",
            "text/html",
            "text/xml",
          ].find(type => {
            return response.headers["content-type"].startsWith(type);
          });
        })
        .find((response, index, array) => {
          const isLastOrOnly = index === array.length - 1;

          return isLastOrOnly
            ? true
            : response.url.startsWith("https");
        });
    });

  if (!response$ || !response$.body) {
    response.status(404);
    response.send();
    return;
  }

  const isDirectRequest = [
    "application/atom+xml",
    "application/rss+xml",
    "application/xml",
    "text/xml",
  ].find(type => {
    return response$.headers["content-type"].startsWith(type);
  });

  let feeds;

  try {
    if (isDirectRequest) {
      const parser = new Parser();
      const feed = await parser.parseString(response$.body);
      feed.url = response$.url;
      feeds = [feed];
    } else {
      feeds = await scrape(response$.body, response$.url);
    }
  } catch (error) {
    response.status(500);
    response.send();
    console.log(error);
    return;
  }

  if (!feeds.length) {
    response.status(404);
    response.send();
    return;
  }

 feeds = feeds
    .map(feed => {
        return {
        get favicon() {
          const url = new URL(process.env.SELF_URL);
          url.pathname = "favicon";
          url.searchParams.set("url", feed.link);
          return url.toString();
        },
        home: feed.link,
        title: sanitize(feed.title).trim(),
        get url() {
          const url = isDirectRequest ? request.query.url : feed.url
          return url.replace(/\/$/, "");
        },
        get published() {
          if (feed.lastBuildDate) {
            try {
              return new Date(feed.lastBuildDate).toISOString();
            } catch (_) {
              return null;
            }
          }
        },
      };
    })
    .reduce((array, feed) => {
      return array.find(({ url }) => url === feed.url)
        ? array
        : array.concat(feed);
    }, []);

  response.setHeader(
    "cache-control",
    "s-maxage=300, stale-while-revalidate",
  );

  response.json(feeds);
};
