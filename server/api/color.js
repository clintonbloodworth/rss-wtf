const colorThief = require("color-thief");

module.exports = (_, response) => {
  response.setHeader(
    'access-control-allow-origin',
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  );

  response.setHeader('cache-control', 's-maxage=300, stale-while-revalidate');
  response.status(200);
  response.send();
};
