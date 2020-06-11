import { get } from 'svelte/store';
import stores from 'stores/index.js';

(async () => {
  const standalone = window.matchMedia('(display-mode: standalone)');
  const state = await stores.state;
  const state$ = get(state);

  if (state$.isStandaloneMode !== standalone.matches) {
    state$.isStandaloneMode = standalone.matches;
    state.set(state$);
  }

  standalone.addListener(event => {
    const state$ = get(state);
    state$.isStandaloneMode = event.matches;
    state.set(state$);
  });
})();
