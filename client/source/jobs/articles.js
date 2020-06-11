import { get } from "svelte/store";
import endpoints from "library/endpoints";
import { emit } from "library/events";
import idleCallback from "library/idle-callback";
import articles from "stores/articles";
import feeds from "stores/feeds";
import user from "stores/user";

idleCallback.request(update);

async function update() {
  await articles.ready;
  await feeds.ready;

  const $user = get(user);

  if (!$user.isAuthenticated) {
    setTimeout(update, process.env.ARTICLES_UPDATE_INTERVAL);
    return;
  }

  const $feeds = get(feeds);

  const updates = Object
    .values($feeds)
    .map(async feed => {
      const articles$ = await endpoints.articles({
        query: {
          since: feed.updated || "",
          url: feed.url,
        },
      });

      const $feeds = get(feeds);

      if (!$feeds[feed.url]) {
        return;
      }

      $feeds[feed.url].updated = new Date().toISOString();

      // We send the `since` parameter. But feeds could still republish
      // a previously published article but with a more recent `published`
      // date. Feeds can do anything, really.
      emit("articles.add", articles$);
    });

  await Promise.allSettled(updates);
  setTimeout(update, process.env.ARTICLES_UPDATE_INTERVAL);
}
