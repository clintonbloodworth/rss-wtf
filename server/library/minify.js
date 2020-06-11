const minifier = require('html-minifier');

module.exports = (html) => {
  return minifier.minify(html, {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  });
};
