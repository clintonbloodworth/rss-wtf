import { get } from "svelte/store";
import endpoints from "library/endpoints";
import isOffline from "stores/offline";

alive();

async function alive() {
  const $isOffline = get(isOffline);

  try {
    await endpoints.alive();
  } catch (error) {
    isOffline.set(true);
    return;
  } finally {
    setTimeout(alive, process.env.ALIVE_CHECK_INTERVAL);
  }

  isOffline.set(false);
}
