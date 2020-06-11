// Imports
const cheerio = require('cheerio');

// Exports
module.exports = html => {
  const $ = cheerio.load(html);

  $('img[src]:not([src=""]), video[poster]:not([poster=""])')
    .each((_, element) => {
      const $element = $(element);
      const isImg = element.tagName === 'img';
      const url = isImg
        ? $element.attr('src')
        : $element.attr('poster');

      const url$ = `${process.env.SELF_URL}/image?url=${encodeURIComponent(url)}`;

      if (isImg) {
        $element.attr('src', url$);
      } else {
        $element.attr('poster', url$);
      }
    });

  return $('body').html(); // <body> and the <html> around it come from Cheerio.
};
