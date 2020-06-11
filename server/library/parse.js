const { JSDOM } = require("jsdom");
const { Readability } = require('@mozilla/readability');

function preparse(html, url) {
  const { document } = new JSDOM(html).window;

  // 1. https://github.com/mozilla/readability/blob/master/Readability.js#L123
  // 2. https://github.com/mozilla/readability/blob/master/Readability.js#L886
  document
    .querySelectorAll(".hljs-comment, .token.comment")
    .forEach((element) => {
      element.className = element.className.replace(/comment/, "readability");
    })

  return document
}

function postparse(html) {
  const { document } = new JSDOM(html).window;

  document
    .querySelectorAll(".hljs-readability, .token.readability")
    .forEach((element) => {
      element.className = element.className.replace(/readability/, "comment");
    })

  return document.documentElement.outerHTML;
}

module.exports = (html, url) => {
  const document = preparse(html, url);
  const readability = new Readability(document, { keepClasses: true });
  let parsed;

  try {
    parsed = readability.parse();
  } catch (_) {
    return {};
  }

  parsed.content = postparse(parsed.content);
  return parsed;
};
