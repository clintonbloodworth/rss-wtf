import debug from "debug";
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
const log = debug("app/jobs/sync");
const removingFromClient = new Set();
const retryDelay = 30000;
const server = new Set();
const addingToServer = new Set();
const removingFromServer = new Set();
let isAuthenticated;
let unsubscribe;

// TODO: retries should back off
// TODO: change sync item back to object

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

  // This could be a retry and the user has since signed out.
  if (!$user.isAuthenticated) {
    return;
  }

  // TODO: what about the case where the user signs out between
  // in feeds.ready and openDatabase? or between openDatabase and
  // subscribe?
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
  // undefined.
  if (unsubscribe) {
    unsubscribe();
  }
}

function openDatabase() {
  log("opening database");

  return new Promise((resolve, reject) => {
    userbase.openDatabase("feeds", items => {
      const urls = items.map(item => item.item);
      log("on server", urls);

      for (const url of urls) {
        server.add(url);
        addToClient(url);
      }

      for (const url of server.values()) {
        if (!urls.includes(url) && !addingToServer.has(url)) {
          server.delete(url);
          removeFromClient(url);
          log("removed from server", url);
        }
      }

      log("server ready");
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
    log("already on client", url);
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
    log("already adding to client", url);
    return;
  }

  log("fetching", url);
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
    // While it would be nice to continue to show loading
    // feedback to let the user know we're still working on
    // getting the feed, there's no telling how many retries
    // there'll be. It could be, for example, that that hosts
    // the feed is down for minutes or hours or longer. And
    // we'd be showing loading feedback the entire time, which
    // would be distracting.
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

    log("fetch fail", url, error);
    return;
  }

  addingToClient.delete(url);
  isLoading.set(false);

  // We gotta get the latest because anything could have happened
  // in the meantime. ANYTHING. The user could have manually added
  // the feed. Or the feed could have been removed from the server
  // on another device.
  $feeds = get(feeds);

  if ($feeds[url] || !server.has(url)) {
    log("no longer needed", url, $feeds[url], server.has(url));
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
  const log$ = log.extend("subscribe");

  unsubscribe = feeds.subscribe($feeds => {
    // TODO: explain this.
    if ($feeds.isResetting) {
      return;
    }

    log$("subscribe callback", $feeds);

    for (const url of removingFromClient.values()) {
      if ($feeds[url]) {
        log$("still on client", url);
        continue;
      }

      log$("removed from client. deleting from set.", url);
      removingFromClient.delete(url);
    }

    const operations = [];

    Object
      .keys($feeds)
      .forEach(url => {
        addingToClient.delete(url);

        if (removingFromClient.has(url)) {
          log$("remvoing from client or server already has", url);
          return;
        }

        if (server.has(url)) {
          log$("server state already has", url);
          return;
        }

        if (addingToServer.has(url)) {
          log$("being added to server", url);
          return;
        }

        log$("push operation", "insert", url);
        addingToServer.add(url);

        operations.push({
          command: "Insert",
          item: url,
          itemId: url,
        });
      });

    for (const url of server.values()) {
      if ($feeds[url]) {
        log$("already on client", url);
        continue;
      }

      if (addingToClient.has(url)) {
        log$("being added to client", url);
        continue;
      }

      if (removingFromServer.has(url)) {
        log$("being removed from server", url);
        continue;
      }

      log$("push operation", "delete", url);
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
  const log$ = log.extend("put");

  if (!operations.length) {
    log$("no operations. returning.");
    return;
  }

  log$("putTransaction", operations);

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
    log$("putTransaction FAILED", operations, error);

    // TODO: rework this so filter doesn't have side effects
    operations = operations.filter(operation => {
      if (operation.command === "Insert" && server.has(operation.itemId)) {
        addingToServer.delete(operation.itemId);
        return false;
      } if (operation.command === "Delete" && !server.has(operation.itemId)) {
        removingFromServer.delete(operation.itemId);
        return false;
      }
      return true;
    });

    if (operations.length) {
      log$("operations remaining. will try again");
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
