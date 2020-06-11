import { writable } from "library/store";

const mediaQueryList = window.matchMedia("(display-mode: standalone)");
const store = writable(mediaQueryList.matches);

mediaQueryList.addListener(event => {
  store.set(event.matches);
});

export default store;
