import { on } from "library/events";
import { writable } from "library/store";

const store = writable({}, {
  adapter: "ls",
  name: "stores/user",
});

on("reset", () => {
  store.set({});
});

export default store;
