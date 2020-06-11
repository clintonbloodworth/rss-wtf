import { on } from "library/events";
import { writable } from "library/store";

const store = writable({}, {
  adapter: "idb",
  name: "stores/articles",
});

on("reset", () => {
  store.set({});
});

export default store;
