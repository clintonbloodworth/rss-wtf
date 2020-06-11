import userbase from 'userbase-js';
import feedsReady from 'stores/feeds.js';
import md5 from 'md5';
import ky from 'ky';
import { get } from 'svelte/store';

// TODO: debounce all this shit

(async () => {
  try {
    await userbase.init({
      appId: process.env.USERBASE_APP_ID,
    });
  } catch (error) {
    // TODO: call alive and keep trying
    console.log(error, 'error');
    console.log('NOOOOOOOOOOOOOOOOOOOOOOOOO');
    return
  }

  let synced = {};

  await userbase.openDatabase({
    databaseName: 'feeds',
    changeHandler(items) {
      items.forEach(async item => {
        synced[item.item.url] = synced[item.item.url] || {}
        synced[item.item.url].updated = item.item.updated ;

        // The handler above is called on every change, and there's
        // no way to unsubscribe. So...
        if (!synced[item.item.url].items) {
          // Why promise?
          synced[item.item.url].ready = new Promise((resolve, reject) => {
            userbase.openDatabase({
              databaseName: item.itemId,
              async changeHandler(items) {
                console.log(items, 'items');
                synced[item.item.url].items = items;
                const feeds = await feedsReady;
                const feeds$ = get(feeds);

                if (feeds$[item.item.url]) {
                  console.log('return');
                  // Syncing database when it already exists locally
                } else {
                  // Syncing database when it does not exist locally

                  // Feeds
                  const url = new URL(process.env.API_URL);
                  url.pathname = 'feeds';
                  url.searchParams.set('url', item.item.url);
                  const response = await ky(url).json();
                  const feed = response.feeds[0];

                  // Feed
                  const url$ = new URL(process.env.API_URL);
                  url$.pathname = 'feed';
                  url$.searchParams.set('url', item.item.url);
                  const items$ = await ky(url$).json();
                  const filtered = Object
                    .values(items$)
                    .filter(item => {
                      return items.find(item$ => {
                        return item$.item.url === item.url;
                      });
                    });

                  feed.items = filtered.reduce((object, item) => {
                    object[item.url] = item;
                    return object;
                  }, {});

                  feed.updated = synced[item.item.url].updated;

                  feeds.set({
                    ...feeds$,
                    [feed.url]: feed,
                  });
                }

                resolve();
              },
            });
          })
        }
      });
    },
  });

  const feeds = await feedsReady;

  feeds.subscribe(async feeds$ => {
    Object
      .values(feeds$)
      .forEach(async feed => {
        // TODO: compare date objects?
        if (!synced[feed.url] || synced[feed.url].updated >= feed.updated) {
          console.log('nope');
          return;
        }

        console.log('meeeeeeeeee');

        await synced[feed.url].ready

        const insertions = Object
          .values(feed.items)
          .filter(item => {
            return !synced[feed.url].items.find(item$ => {
              return item$.item.url === item.url;
            });
          })
          .map(({ date, url }) => {
            return {
              command: 'Insert',
              item: { date, url },
              itemId: md5(url),
            };
          })


        const deletions = Object.values(feed.items)
          .filter(item => {
            return synced[feed.url].items.find(item$ => {
              return item$.item.url === item.url && item.isRead;
            });
          })
          .map(({ date, url }) => {
            return {
              command: 'Delete',
              itemId: md5(url),
            };
          })

        const operations = insertions.concat(deletions);

        if (!operations.length) {
          return;
        }

        await userbase.putTransaction({
          operations,
          databaseName: md5(feed.url),
        });

        await userbase.updateItem({
          databaseName: 'feeds',
          item: {
            url: feed.url,
            updated: new Date().toISOString(),
          },
          itemId: md5(feed.url),
        });

        console.log('success');
      });
  });
})();
