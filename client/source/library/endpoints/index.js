import dayjs from "dayjs";
import fetch from "library/fetch";

export default {
  alive: fetch({
    method: "head",
    url: "alive",
  }),
  articles: fetch({
    query: {
      since: dayjs().subtract(30, "day").toISOString(),
    },
    url: "articles",
  }).json(),
  feeds: fetch({ url: "feeds" }).json(),
  hoefler: fetch({ url: "hoefler" }),
};
