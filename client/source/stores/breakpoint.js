import breakpoints from "library/breakpoints";
import partial from "library/partial";
import { writable } from "library/store";

const mediaQueries = new Map();
const store = writable("");

Object
  .entries(breakpoints)
  .forEach(([name, query]) => {
    mediaQueries.set(name, window.matchMedia(query));
  });

for (const [name, query] of mediaQueries) {
  match(name, query);
  query.addListener(partial(match, name));
}

function match(name, query) {
  if (name === "--large" && query.matches) {
    store.set("large");
  } else if (name === "--medium" && query.matches) {
    store.set("medium");
  } else if (name === "--small" && query.matches) {
    store.set("small");
  } else {
    store.set("");
  }
}

export default store;
