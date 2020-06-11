const ColorHash = require("color-hash");
const colorHash = new ColorHash();

module.exports = (string) => colorHash.rgb(string).join(",");
