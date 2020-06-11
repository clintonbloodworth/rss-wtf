import ky from 'ky';
import { get } from 'svelte/store';
import stateReady from 'stores/state.js';
import feedsReady from 'stores/feeds.js';

(async () => {
  const feeds = await feedsReady;
  const state = await stateReady;

  // schedule();

  feeds.subscribe(async feeds$ => {

    // TODO: chunk this
    // const unread = Object
    //   .values(feeds$)
    //   .flatMap(feed => Object.values(feed.items))
    //   .filter(item => !item.isRead)
    //   .length;

    // const state$ = get(state);

    // if (state$.unread !== unread) {
    //   state$.unread = unread;
    //   state.set(state$);
    // }
  });
})();

async function schedule() {
  const feeds = await feedsReady;
  const feeds$ = get(feeds);
  await update(feeds$);
  setTimeout(schedule, 30000);
}

async function update(feeds$) {
  console.log('update');
  const state = await stateReady;
  const state$ = get(state);
  // TODO: don't update all at once, chunk?

  const updates = Object
    .entries(feeds$)
    .map(async ([url, feed]) => {
      const url$ = new URL(process.env.API_URL);

      if (feed.updated) {
        const since = feed.updated;
        url$.searchParams.set('since', since);
      }

      let isDeleted;

      // Tidy up
      Object.values(feed.items).forEach(item => {
        if (item.isRead) {
          delete feed.items[item.url];
          isDeleted = true;
        }
      });

      // TODO: this this once, at end, if response.legnth or isDeleted.
      if (isDeleted) {
        const feeds = await feedsReady;
        const feeds$ = get(feeds); // feeds may have changed between request and now.
        feeds.set(feeds$);
      }

      // Update
      url$.pathname = 'feed';
      url$.searchParams.set('url', url);
      const updated = new Date().toISOString();
      const response = await ky(url$).json();

      if (Object.keys(response).length) {
        // TODO: $feeds is constantly changing with 2ality and reasonml.
        feed.updated = updated;
        const feeds = await feedsReady;
        const feeds$ = get(feeds); // feeds may have changed between request and now.
        feeds$[url].items = Object.assign(feed.items, response);

        // TODO: requestIdleCallback
        feeds.set(feeds$);
      }
    });

  await Promise.all(updates);
}
