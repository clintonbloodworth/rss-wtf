const isRelative = require("is-relative-url");
const join = require("url-join");
const { default: ow } = require("ow");

module.exports = (url, base) => {
  ow(url, ow.string.not.empty);
  ow(base, ow.string.not.empty);

  if (!isRelative(url)) {
    return url;
  }

  const { origin, pathname, protocol } = new URL(base);

  if (url.startsWith("//")) {
    return url.replace(/^\/\//, `${protocol}//`);
  } else if (url.startsWith("/")) {
    return join(origin, url);
  } else if (url.startsWith("./")) {
    const segments = pathname.split("/")
    segments.pop();
    return join(origin, segments.join("/"), url.replace(/^\./, ""));
  } else {
    return join(base, url);
  }
};
