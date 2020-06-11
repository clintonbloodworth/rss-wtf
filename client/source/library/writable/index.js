import clone from "clone";
import debug from "debug";
import { diff } from "deep-object-diff";
import { openDB } from "idb";

// TODO: you can't assume that article or feed is in
// database if it's in memory. it can be deleted while
// the app is running.

// TODO: throw error is idb and current no obj?
export default (current, { adapter, name } = {}) => {
  if (adapter && !name) {
    const error = new Error("name");
    error.name = "MissingArgument";
    throw error;
  }

  const callbacks = [];
  let cloned = clone(current, false);
  let database;

  function set(proposed) {
    cloned = clone(proposed, false);

    for (const callback of callbacks) {
      try {
        callback(cloned);
      } catch {}
    }

    if (adapter === "ls") {
      requestIdleCallback(() => {
        const json = JSON.stringify(proposed);
        window.localStorage.setItem(name, json);
      });

      current = proposed;
    } else if (adapter === "idb") {
      const transaction = database.transaction(name, "readwrite");

      Object
        .keys(current)
        .filter(key => proposed[key] === undefined)
        .forEach(key => {
          transaction.store.delete(key);
        });

      Object
        .keys(proposed)
        .forEach(key => {
          const isNew = current[key] === undefined;

          if (isNew) {
            transaction.store.put(proposed[key], key);
            return;
          }

          const differences = diff(proposed[key], current[key]);
          const isDifferent = Object.keys(differences).length;

          if (isDifferent) {
            console.log("writable:differences", differences);
            transaction.store.put(proposed[key], key);
          }
        });

      current = proposed;
    }
  }

  function subscribe(callback) {
    callback(cloned);
    const unique = cloned => { callback(cloned); };
    callbacks.push(unique);

    return () => {
      const index = callbacks.indexOf(unique);

      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  const writable = { set, subscribe };

  if (adapter === "ls") {
    const json = window.localStorage.getItem(name);

    if (json) {
      current = JSON.parse(json);
      cloned = clone(current, false);
    }
  } else if (adapter === "idb") {
    writable.ready = openDB(name, 1, {
      upgrade(database) {
        database.createObjectStore(name);
      },
    }).then(async database$ => {
      let cursor = await database$
        .transaction(name)
        .store
        .openCursor();

      while (cursor) {
        current[cursor.key] = cursor.value;
        cursor = await cursor.continue(); // eslint-disable-line no-await-in-loop
      }

      cloned = clone(current, false);

      // Callbacks are called directly instead of through
      // `writable.set` to avoid needless iteration and
      // diffing.
      for (const callback of callbacks) {
        try {
          callback(cloned);
        } catch {}
      }

      database = database$;
    });
  }

  return writable;
};
