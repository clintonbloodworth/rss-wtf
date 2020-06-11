import { get } from "svelte/store";
import { on } from "library/events";
import idleCallback from "library/idle-callback";
import partial from "library/partial";
import articles from "stores/articles";

prune();

function prune() {
  setTimeout(async () => {
    const $articles = get(articles);
    await articles.ready;
    const articles$ = Object.values($articles);

    for (const article of articles$) {
    }
  }, process.env.PRUNE_INTERVAL);
}
