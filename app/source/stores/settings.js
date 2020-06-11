// Imports
import { writable } from 'svelte/store';
import {
  get,
  set,
  Store as IdbStore,
} from 'idb-keyval';

// Functions
async function setup() {
  const settings = writable();
  const idbStore = new IdbStore('settings', 'everything');
  const everything = await get('everything', idbStore);

  if (everything) {
    settings.set(everything);
  } else {
    await set('everything', {}, idbStore);
    settings.set({});
  }

  settings.subscribe(current => {
    set('everything', current, idbStore);
  });

  return settings;
}

// Exports
export default setup();
