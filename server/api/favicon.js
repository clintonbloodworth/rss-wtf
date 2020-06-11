const buildAbsoluteUrl = require("../library/build-absolute-url");
const fileType = require("file-type");
const got = require("got");
const imageSize = require("image-size");
const isSvg = require("is-svg");
const url = require("url");
const { default: ow } = require("ow");
const { JSDOM } = require("jsdom");

module.exports = async (request, response) => {
  response.setHeader("access-control-allow-origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

  try {
    ow(request.query.url, ow.string.not.empty);
  } catch (error) {
    response.status(400);
    response.send();
    return;
  }

  let html;

  try {
    let secure;
    let insecure;

    if (request.query.url.startsWith("http:")) {
      secure = request.query.url.replace("http:", "https:");
      insecure = request.query.url;
    } else if (request.query.url.startsWith("https:")) {
      secure = request.query.url;
      insecure = request.query.url.replace("https:", "http:");
    } else {
      const url$ = request.query.url.trim().replace(/^\/\//, "");
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
    console.log(error);
    response.status(404);
    response.send();
    return;
  }

  let document;

  try {
    ({ document } = new JSDOM(html).window);
  } catch (error) {
    console.log(error);
    response.status(404);
    response.send();
    return;
  }

  const [favicon] = await Promise.allSettled([
    `link[rel="icon"]`,
    `link[rel="shortcut icon"]`,
    `link[rel="apple-touch-icon"]`,
    "/favicon.ico",
  ].flatMap(selectorOrAbsolutePath => {
    if (selectorOrAbsolutePath.startsWith("/")) {
      const url = buildAbsoluteUrl(selectorOrAbsolutePath, request.query.url);

      return got(url, { responseType: "buffer" })
        .then(response => response.body);
    }

    const requests = [];

    document
      .querySelectorAll(selectorOrAbsolutePath)
      .forEach(element => {
        if (!element.href) {
          return;
        }

        const url = buildAbsoluteUrl(element.href, request.query.url);

        const request$ = got(url, { responseType: "buffer" })
          .then(response => response.body);

        requests.push(request$);
      })

    return requests;
  })).then(async results => {
    const favicons = await Promise.all(results
      .filter(({ status }) => status === "fulfilled")
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
            ? "image/svg+xml"
            : (await fileType.fromBuffer(buffer)).mime;
        } catch (error) {
          console.log(error);
          return null;
        }

        const isValid = [
          "image/gif",
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/vnd.microsoft.icon",
          "image/x-icon",
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

        if (!height || !width) {
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
      .sort((a, b) => (a.type === "image/svg+xml" || a.height >= b.height ? -1 : 1));
  });

  if (!favicon) {
    response.status(404);
    response.send();
    return;
  }

  response.setHeader("cache-control", "s-maxage=3600, stale-while-revalidate");
  response.setHeader("content-type", favicon.type);
  response.send(favicon.buffer);
};
