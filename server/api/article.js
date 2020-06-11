const format = require("../library/format");
const got = require("got");
const minify = require("../library/minify");
const parse = require("../library/parse");
const sanitize = require("../library/sanitize");
const { default: ow } = require("ow");

module.exports = async (request, response) => {
  response.setHeader("access-control-allow-origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

  try {
    ow(request.query.url, ow.string.not.empty);
  } catch {
    response.status(400);
    response.send();
    return;
  }

  let html;
  let title;

  try {
    const response = await got(request.query.url, {
      headers: {
        "accept": "text/html",
      }
    });

    if (!request.query.no_parse) {
      ({ content: html, title } = parse(response.body, request.query.url));
    }

    if (!request.query.no_sanitize) {
      html = sanitize(html);
    }

    if (!request.query.no_format) {
      html = format(html, title, request.query.url);
    }

    if (!request.query.no_minify) {
      html = minify(html);
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send();
    return;
  }

  response.setHeader("cache-control", "s-maxage=300, stale-while-revalidate");
  response.setHeader("content-type", "text/html");
  response.send(html);
};
