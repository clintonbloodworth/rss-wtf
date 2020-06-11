import ky from 'ky';
import { get } from 'svelte/store';
import stores from 'stores/index.js';

(async function alive() {
  const state = await stores.state;
  const state$ = get(state);

  try {
    const url = new URL(process.env.SELF_URL);
    url.pathname = 'alive';
    await ky.head(url);
  } catch {
    state$.isOffline = true;
    state.set(state$);
    return;
  } finally {
    // TODO: get configuration from store
    setTimeout(alive, 5000);
  }

  if (state$.isOffline) {
    state$.isOffline = false;
    state.set(state$);
  }
}());
