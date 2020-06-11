// Imports
const buildAbsoluteUrl = require('@docset/utilities/buildAbsoluteUrl');
const cheerio = require('cheerio');
const { highlightAuto } = require('highlight.js');

// Functions
function format(html, baseUrl) {
  const $ = cheerio.load(html);

  $('[src]:not([src=""])').each((_, element) => {
    const $element = $(element);
    const url = $element.attr('src');
    const url$ = baseUrl ? buildAbsoluteUrl(baseUrl, url) : url;

    $element.attr('data-src', url$);

    if (element.tagName === 'img') {
      $element.attr('src', url$);
    } else {
      $element.removeAttr('src');
    }
  });

  $('a').each((_, element) => {
    const $element = $(element);
    $(element).attr('rel', 'noopener');

    const url = $element.attr('href');

    if (url && baseUrl) {
      const url$ = buildAbsoluteUrl(baseUrl, url);
      $(element).attr('href', url$);
    }
  });

  $('article').each((_, element) => {
    element.tagName = 'div';
  });

  $('audio[src]:not([src=""]), iframe[src]:not([src=""]), video[src]:not([src=""])').each((_, element) => {
    const $element = $(element);
    const url = $element.attr('src').replace(/^http:/, 'https:');
    $element.attr('data-src', url);
  });

  $('audio, video').each((_, element) => {
    const $element = $(element);
    $element.attr('controls', 'controls');
    $element.attr('preload', 'none');
  });

  $('video[poster]:not([poster=""])').each((_, element) => {
    const $element = $(element);
    const url = $element.attr('poster');
    const url$ = buildAbsoluteUrl(baseUrl, url);
    $element.attr('poster', url$);
  });

  $('track[default]').each((_, element) => {
    const $element = $(element);
    $element.attr('default', 'default');
  });

  $('img').each((_, element) => {
    $(element).attr('crossorigin', 'anonymous');
  });

  $('pre code').each((_, element) => {
    const $element = $(element);
    const html = $element.html();
    const { value } = highlightAuto(html);
    $element.html(value);
  });

  $('p > b:first-child, p > strong:first-child').each((_, element) => {
    const $element = $(element);
    const text = $element.text();
    $element.replaceWith(text);
  });

  $('picture').each((_, element) => {
    const $element = $(element);
    const $img = $element.find('img');

    if (!$img.length) {
      $element.remove();
      return;
    }

    const html = $.html($img);
    $element.replaceWith(html);
  });

  $('body').get(0).tagName = 'article'; // <body> and the <html> around it come from Cheerio.
  return $.html();
}

// Exports
module.exports = format;
