// Imports
import { writable } from 'svelte/store';
import {
  get,
  set,
  Store as IdbStore,
} from 'idb-keyval';

// Functions
async function setup() {
  const feeds = writable();
  const idbStore = new IdbStore('feeds', 'everything');
  const everything = await get('everything', idbStore);

  if (everything) {
    feeds.set(everything);
  } else {
    await set('everything', {}, idbStore);
    feeds.set({});
  }

  feeds.subscribe(current => {
    set('everything', current, idbStore);
  });

  return feeds;
}

// Exports
export default setup();
