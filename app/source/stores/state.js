import { writable } from 'svelte/store';
import {
  get,
  set,
  Store as IdbStore,
} from 'idb-keyval';

async function setup() {
  const state = writable();
  const idbStore = new IdbStore('state', 'everything');
  const everything = await get('everything', idbStore);

  if (everything) {
    state.set(everything);
  } else {
    await set('everything', {}, idbStore);
    state.set({
      history: {},
    });
  }

  state.subscribe(current => {
    set('everything', current, idbStore);
  });

  return state;
}

export default setup();
