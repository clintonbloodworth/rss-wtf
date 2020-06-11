// Imports
const { parse } = require('@docset/mercury-parser');
const headings = require('@docset/utilities/headings');
const cheerio = require('cheerio');
const UserAgents = require('user-agents');

// Exports
module.exports = async (url, html) => {
  // TODO: add language suppor to mercury

  const {
    content,
    date,
    error,
    message,
    title = url.replace(/http(s)?:\/\//, ''),
    url: url$,
  } = await parse(url, {
    html,
    headers: {
      'user-agent': new UserAgents().toString(),
    },
  });

  if (error) {
    throw new Error(message);
  }

  const $ = cheerio.load(content);
  const characters = $.root().text().trim().length;

  if (characters < process.env.ARTICLE_CHARACTER_MINIMUM) {
    const message = `Not enough content: ${characters} characters(s)`;
    throw new Error(message);
  }

  return {
    date,
    title,
    headings: headings($, url$),
    html: title
      ? `<h1><a href="${url$}">${title}</a></h1>${$('body').html()}`
      : content,
    url: url$,
  };
};
