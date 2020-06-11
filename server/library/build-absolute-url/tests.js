const test = require("ava");
const buildAbsoluteUrl = require(".");

test("builds exact URL if absolute", t => {
  t.is(
    buildAbsoluteUrl("https://example.com", "https://example.com"),
    "https://example.com",
  );

  t.is(
    buildAbsoluteUrl("https://example.com/path", "https://example.com"),
    "https://example.com/path",
  );
});

test("builds absolute URL from protocol-relative one", t => {
  t.is(
    buildAbsoluteUrl("//example.com/path", "https://example.com"),
    "https://example.com/path",
  );

  t.is(
    buildAbsoluteUrl("//example.com/path", "https://example.com"),
    "https://example.com/path",
  );
});

test("builds absolute URL from relative path", t => {
  t.is(
    buildAbsoluteUrl("path", "https://example.com"),
    "https://example.com/path",
  );

  t.is(
    buildAbsoluteUrl("nested/path/favicon.svg", "https://example.com"),
    "https://example.com/nested/path/favicon.svg",
  );

  t.is(
    buildAbsoluteUrl("./nested/path/favicon.svg", "https://example.com"),
    "https://example.com/nested/path/favicon.svg",
  );
});

test("builds absolute URL from absolute path", t => {
  t.is(
    buildAbsoluteUrl("/path", "https://example.com"),
    "https://example.com/path",
  );

  t.is(
    buildAbsoluteUrl("/nested/path", "https://example.com"),
    "https://example.com/nested/path",
  );
});
