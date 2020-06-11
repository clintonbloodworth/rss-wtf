import 'jobs/alive.js';
import 'jobs/color.js';
import 'jobs/feeds.js';
import 'jobs/sync.js';
import 'jobs/standalone.js';
import App from 'app';
import feeds from 'stores/feeds.js';
import settings from 'stores/settings.js';
import state from 'stores/state.js';
import { get } from 'svelte/store';
import userbase from 'userbase-js';

let isRefreshing;

navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (isRefreshing) {
    return;
  }

  isRefreshing = true;
  window.location.reload();
});

Promise.all([
  window.navigator.serviceWorker.register('/offline.js'),
  initUserbase(),
]).then(async () => {
    // eslint-disable-next-line no-new
    new App({
      props: {
        feeds: await feeds,
        settings: await settings,
        state: await state,
      },
      target: document.querySelector('body'),
    });
  }).catch(error => {
    // TODO: app fails if stores aren't passed
    console.log(error, 'error');
    // eslint-disable-next-line no-new
    new App({
      props: {
        error,
      },
      target: document.querySelector('body'),
    });
  });

async function initUserbase() {
  let session;

  try {
    session = await userbase.init({
      appId: process.env.USERBASE_APP_ID,
    });
  } catch (error) {
    console.log(error, 'erro');
    console.log('NOOOOOOOOOOOOOOOOOOOOOOOOO');
    return
  }

  const state$ = await state;
  const state$$ = get(state$);

  // TODO: only set state if different
  state$.set({
    ...state$$,
    isAuthenticated: Boolean(session.user),
  });
}
