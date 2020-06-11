import { tick } from "svelte";
import { on } from "library/events";
import writable from "library/writable";

const store = writable({}, {
  adapter: "idb",
  name: "stores/feeds",
});

on("reset", async () => {
  store.set({
    isResetting: true,
  });

  await tick();
  store.set({});
});

export default store;
