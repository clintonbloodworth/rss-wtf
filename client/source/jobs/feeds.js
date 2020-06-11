import { get } from "svelte/store";
import endpoints from "library/endpoints";
import { emit } from "library/events";
import idleCallback from "library/idle-callback";
import feeds from "stores/feeds";
import user from "stores/user";

idleCallback.request(update);

async function update() {
  await feeds.ready;

  const $user = get(user);

  if (!$user.isAuthenticated) {
    setTimeout(update, process.env.FEEDS_UPDATE_INTERVAL);
    return;
  }

  const $feeds = get(feeds);

  const updates = Object
    .values($feeds)
    .map(async feed => {
      let home;
      let title;

      try {
        const [feed$] = await endpoints.feeds({
          query: {
            url: feed.url,
          },
        });

        home = feed$.home;
        title = feed$.title;
      } catch {
        return;
      }

      const $feeds = get(feeds);

      if (!$feeds[feed.url]) {
        return;
      }

      if (home && home !== feed.home) {
        $feeds[feed.url].home = home;
        feeds.set($feeds);
      }

      if (title && title !== feed.title) {
        $feeds[feed.url].title = title;
        feeds.set($feeds);
      }
    });

  await Promise.allSettled(updates);
  setTimeout(update, process.env.FEEDS_UPDATE_INTERVAL);
}
