import md5 from "md5";
import { get } from "svelte/store";
import endpoints from "library/endpoints";
import { emit } from "library/events";
import partial from "library/partial";
import userbase from "library/userbase";
import articles from "stores/articles";
import feeds from "stores/feeds";
import isLoading from "stores/loading";
import isOffline from "stores/offline";
import user from "stores/user";

const addingToClient = new Set();
const removingFromClient = new Set();
const retryDelay = 30000;
const server = new Set();
const addingToServer = new Set();
const removingFromServer = new Set();
let isAuthenticated;
let unsubscribe;

user.subscribe(() => {
  const $user = get(user);

  if ($user.isAuthenticated && !isAuthenticated) {
    isAuthenticated = true;
    start();
  } else if (!$user.isAuthenticated && isAuthenticated) {
    isAuthenticated = false;
    stop();
  }
});

async function start() {
  const $user = get(user);

  // Could be a retry and the user has since signed out.
  if (!$user.isAuthenticated) {
    return;
  }

  try {
    await feeds.ready;
    await openDatabase();
    unsubscribe = subscribe();
  } catch {
    setTimeout(start, retryDelay);
  }
}

function stop() {
  addingToClient.clear();
  removingFromClient.clear();
  server.clear();

  // It could be that the user signed in and `start` was
  // called but hasn't finished. Meanwhile, the user could
  // have signed out, in which case `unsubscribe` will be
  // `undefined`.
  if (unsubscribe) {
    unsubscribe();
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    userbase.openDatabase("feeds", items => {
      const urls = items.map(item => item.item);

      for (const url of urls) {
        server.add(url);
        addToClient(url);
      }

      for (const url of server.values()) {
        if (!urls.includes(url) && !addingToServer.has(url)) {
          server.delete(url);
          removeFromClient(url);
        }
      }

      resolve();
    }).catch(reject);
  });
}

async function addToClient(url) {
  let $feeds = get(feeds);

  // It's unlikely but possible that this is a retry and
  // the user has since added the feed manually.
  if ($feeds[url]) {
    addingToClient.delete(url);
    return;
  }

  // If `changeHandler` is called again while we're still
  // fetching a feed from a previous `changeHandler` call,
  // then we want to skip fetching it. The previous fetch will
  // either succeed or continue to retry until the page is
  // refreshed, in which case `addingToClient` will once again
  // be empty and any feeds that still haven't been fetched
  // will be tried again if they're still on the server.
  if (addingToClient.has(url)) {
    return;
  }

  addingToClient.add(url);
  isLoading.set(true);

  let responses;

  try {
    responses = await Promise.all([
      endpoints.articles({
        query: { url },
      }),
      endpoints.feeds({
        query: { url },
      }),
    ]);
  } catch (error) {
    // It would be nice to continue to show loading feedback to
    // let the user know we're still working on getting the feed,
    // but there's no telling how many retries there'll be. It
    // could be, for example, that the feed host is down for minutes
    // or hours or longer. And we'd be showing loading feedback the
    // entire time, which would be distracting.
    isLoading.set(false);

    const $isOffline = get(isOffline);

    if ($isOffline) {
      const unsubscribe = isOffline.subscribe($isOffline => {
        if (!$isOffline) {
          unsubscribe();
          addToClient(url);
        }
      });
    } else {
      setTimeout(() => {
        addToClient(url);
      }, retryDelay);
    }

    return;
  }

  addingToClient.delete(url);
  isLoading.set(false);

  // We have to get the latest because anything could have happened
  // in the meantime. ANYTHING. The user could have manually added
  // the feed. Or the feed could have been removed from the server
  // on another device.
  $feeds = get(feeds);

  if ($feeds[url] || !server.has(url)) {
    return;
  }

  emit("articles.add", responses[0]);
  emit("feed.add", responses[1][0]);
}

function removeFromClient(url) {
  const $feeds = get(feeds);
  const $articles = get(articles);

  const ids = Object
    .values($articles)
    .filter(article => article.feed === url)
    .map(article => article.id);

  emit("articles.remove", ids);

  if ($feeds[url]) {
    emit("feed.remove", url);
  }
}

function subscribe() {
  unsubscribe = feeds.subscribe($feeds => {
    // This isn't great. Switching from one user to another or
    // deleting a user initiates a data reset. The `user.subscribe`
    // callback will take care of unsusbcribing from. But we can't
    // rely on the `user.subscribe` callback to be called before this
    // callback. So I've chosen to couple `$feeds` and sync. That store
    // is reset once with `isResetting`. Then it's reset again with an
    // empty object. By the time the second reset happens, `user.subscribe`
    // has unsubscribed us and this callback isn't called until the
    // user logs in again.
    if ($feeds.isResetting) {
      return;
    }

    for (const url of removingFromClient.values()) {
      if ($feeds[url]) {
        continue;
      }

      removingFromClient.delete(url);
    }

    const operations = [];

    Object
      .keys($feeds)
      .forEach(url => {
        addingToClient.delete(url);

        if (removingFromClient.has(url) || server.has(url) || addingToServer.has(url)) {
          return;
        }

        addingToServer.add(url);

        operations.push({
          command: "Insert",
          item: url,
          itemId: url,
        });
      });

    for (const url of server.values()) {
      if (addingToClient.has(url) || $feeds[url] || removingFromServer.has(url)) {
        continue;
      }

      removingFromServer.add(url);

      operations.push({
        command: "Delete",
        itemId: url,
      });
    }

    put(operations);
  });
}

async function put(operations) {
  if (!operations.length) {
    return;
  }

  try {
    await userbase.putTransaction({
      databaseName: "feeds",
      operations: operations.map(operation => {
        return {
          ...operation,
          itemId: md5(operation.itemId),
        };
      }),
    });
  } catch (error) {
    operations.forEach(operation => {
      if (operation.command === "Insert" && server.has(operation.itemId)) {
        addingToServer.delete(operation.itemId);
      }

      if (operation.command === "Delete" && !server.has(operation.itemId)) {
        removingFromServer.delete(operation.itemId);
      }
    });

    operations = operations.filter(operation => {
      return !(operation.command === "Insert" && server.has(operation.itemId))
        && !(operation.command === "Delete" && !server.has(operation.itemId));
    });

    if (operations.length) {
      setTimeout(partial(put, operations), retryDelay);
    }
  }

  operations.forEach(operation => {
    if (operation.command === "Insert") {
      addingToServer.delete(operation.itemId);
      server.add(operation.itemId);
    } else {
      removingFromServer.delete(operation.itemId);
      server.delete(operation.itemId);
    }
  });
}
