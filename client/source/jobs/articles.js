import sAgo from "s-ago";
import { get } from "svelte/store";
import endpoints from "library/endpoints";
import { emit } from "library/events";
import articles from "stores/articles";
import feeds from "stores/feeds";
import isOffline from "stores/offline";
import updated from "stores/updated";
import user from "stores/user";

(async function job() {
  await articles.ready;
  await feeds.ready;

  const $isOffline = get(isOffline);
  const $user = get(user);

  if (!$user.isAuthenticated || $isOffline) {
    setTimeout(job, process.env.ARTICLES_UPDATE_INTERVAL);
    return;
  }

  const $feeds = get(feeds);

  const updates = Object
    .values($feeds)
    .map(async feed => {
      const articles$ = await endpoints.articles({
        query: {
          since: feed.updated,
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

  updated.set({
    absolute: new Date(),
    relative: `Updated: ${sAgo(new Date())}`,
  });

  setTimeout(job, process.env.ARTICLES_UPDATE_INTERVAL);
}());
