const bytes = require("bytes");
const { default: ow } = require("ow");

module.exports = buffer => {
  ow(buffer, ow.buffer);
  const mb = bytes(buffer.length, { unit: "MB" });
  return parseInt(mb, 10) >= 6;
};
