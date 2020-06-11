import { on } from "library/events";
import writable from "library/writable";

const store = writable("", {
  adapter: "ls",
  name: "stores/feed",
});

on("reset", () => {
  store.set("");
});

export default store;
