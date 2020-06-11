import endpoints from "library/endpoints";
import isOffline from "stores/offline";

(async function job() {
  try {
    await endpoints.alive();
  } catch (error) {
    isOffline.set(true);
    return;
  } finally {
    setTimeout(job, process.env.ALIVE_CHECK_INTERVAL);
  }

  isOffline.set(false);
}());
