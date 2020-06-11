const got = require("got");

module.exports = async (request, response) => {
  const { statusCode } = await got(process.env.HOEFLER_URL, {
    headers: {
      Accept: "text/css",
      Connection: "close",
      Referer: "https://rss.wtf",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": request.headers["user-agent"],
    },
    throwHttpErrors: false,
  });

  response.setHeader(
    "access-control-allow-origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  );

  response.setHeader("cache-control", "s-maxage=300, stale-while-revalidate");
  response.status(statusCode === 403 ? 403 : 200);
  response.send();
};
