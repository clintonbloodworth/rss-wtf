const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const { default: ow } = require("ow");

module.exports = (html, url) => {
  ow(html, ow.string.not.empty);
  ow(url, ow.string.not.empty);

  const { document } = new JSDOM(html).window;
  const readability = new Readability(document, { keepClasses: true });
  let parsed;

  try {
    parsed = readability.parse();
  } catch (_) {
    return {};
  }

  if (parsed === null) {
    return {};
  }

  return parsed;
};
