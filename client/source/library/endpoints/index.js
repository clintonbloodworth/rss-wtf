import fetch from "library/fetch";

export default {
  alive: fetch({
    method: "head",
    url: "alive",
  }),
  articles: fetch({
    query: {
      limit: 100,
    },
    url: "articles",
  }).json(),
  feeds: fetch({ url: "feeds" }).json(),
  hoefler: fetch({ url: "hoefler" }),
};
