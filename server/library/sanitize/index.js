const sanitize = require("sanitize-html");
const configuration = require("./configuration");
module.exports = html => sanitize(html, configuration)
