import dayjs from "dayjs";
import { get } from "svelte/store";
import { emit } from "library/events";
import idleCallback from "library/idle-callback";
import articles from "stores/articles";

(function job() {
  idleCallback.request(async () => {
    await articles.ready;
    const $articles = get(articles);
    const old = dayjs().subtract(31, "day");

    const ids = Object
      .values($articles)
      .filter(article => dayjs(article.published).isBefore(old))
      .map(article => article.id);

    if (ids.length) {
      emit("articles.remove", ids);
    }

    setTimeout(job, process.env.PRUNE_INTERVAL);
  });
}());
