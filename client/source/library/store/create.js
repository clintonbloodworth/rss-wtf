import clone from "clone";
import { diff } from "deep-object-diff";
import { openDB } from "idb";
import idleCallback from "../idle-callback";

export default (value, options = {}) => {
  if (options.adapter && !options.name) {
    const error = new Error("name");
    error.name = "MissingArgument";
    throw error;
  }

  if (options.adapter === "idb" && (value === null || typeof value !== "object")) {
    throw new TypeError("value");
  }

  const callbacks = [];
  let current = value;
  let cloned = clone(current, false);
  let database;

  function set(proposed) {
    cloned = clone(proposed, false);

    for (const callback of callbacks) {
      try {
        callback(cloned);
      } catch {}
    }

    if (options.adapter === "ls") {
      idleCallback.request(() => {
        const json = JSON.stringify(proposed);
        window.localStorage.setItem(options.name, json);
      });

      current = proposed;
    } else if (options.adapter === "idb") {
      const transaction = database.transaction(options.name, "readwrite");

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
            transaction.store.put(proposed[key], key);
          }
        });

      current = proposed;
    }
  }

  function subscribe(callback) {
    if (callbacks.length === 0 && options.callback) {
      options.callback = options.callback();
    }

    callback(cloned);
    const unique = cloned => { callback(cloned); };
    callbacks.push(unique);

    return () => {
      const index = callbacks.indexOf(unique);

      if (index > -1) {
        callbacks.splice(index, 1);
      }

      if (callbacks.length === 0 && options.callback) {
        options.callback();
      }
    };
  }

  const store = { set, subscribe };

  if (options.adapter === "ls") {
    const json = window.localStorage.getItem(options.name);

    if (json) {
      current = JSON.parse(json);
      cloned = clone(current, false);
    }
  } else if (options.adapter === "idb") {
    store.ready = openDB(options.name, 1, {
      upgrade(database) {
        database.createObjectStore(options.name);
      },
    }).then(async database$ => {
      let cursor = await database$
        .transaction(options.name)
        .store
        .openCursor();

      while (cursor) {
        current[cursor.key] = cursor.value;
        cursor = await cursor.continue(); // eslint-disable-line no-await-in-loop
      }

      cloned = clone(current, false);

      // Callbacks are called directly instead of through
      // `store.set` to avoid needless iteration and
      // diffing.
      for (const callback of callbacks) {
        try {
          callback(cloned);
        } catch {}
      }

      database = database$;
    });
  }

  return store;
};
