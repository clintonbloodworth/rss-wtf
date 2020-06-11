const isRelative = require("is-relative-url");
const { default: ow } = require("ow");
const join = require("url-join");

module.exports = (url, base) => {
  ow(url, ow.string.not.empty);
  ow(base, ow.string.not.empty);

  if (!isRelative(url)) {
    return url;
  }

  const { origin, pathname, protocol } = new URL(base);

  if (url.startsWith("//")) {
    return url.replace(/^\/\//, `${protocol}//`);
  } if (url.startsWith("/")) {
    return join(origin, url);
  } if (url.startsWith("./")) {
    const segments = pathname.split("/");
    segments.pop();
    return join(origin, segments.join("/"), url.replace(/^\./, ""));
  }
  return join(base, url);
};
