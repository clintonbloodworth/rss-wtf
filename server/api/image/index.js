const got = require("got");
const { default: ow } = require("ow");
const isImageTooLarge = require("./is-too-large");

module.exports = async (request, response) => {
  response.setHeader(
    "access-control-allow-origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  );

  try {
    ow(request.query.url, ow.string.not.empty);
  } catch (error) {
    response.status(400);
    response.send();
    return;
  }

  let response$;

  try {
    response$ = await got(request.query.url, { responseType: "buffer" });
  } catch (error) {
    console.log(error);
    response.status(404);
    response.send();
    return;
  }

  if (isImageTooLarge(response$.body)) {
    response.status(500);
    response.send();
  } else if (response$.headers["content-type"].startsWith("image")) {
    response.setHeader("cache-control", "s-maxage=300, stale-while-revalidate");
    response.setHeader("content-type", response$.headers["content-type"]);
    response.send(response$.body);
  } else {
    response.status(404);
    response.send();
  }
};
