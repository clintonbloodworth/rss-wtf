import "jobs/alive";
import "jobs/articles";
import "jobs/feeds";
import "jobs/prune";
import "jobs/sync";
import "jobs/updated";
import debug from "debug";
import { isSafari } from "library/browser";
import Router from "router";

window.navigator.serviceWorker.register("/worker.js");

// TODO: what to do about this. need to incorporate its
// CSS class or get rid of it.
if (isSafari) {
  import("focus-visible");
}

if (process.env.NODE_ENV === "development") {
  debug.enable("*");
  window.debug = debug;
}

// eslint-disable-next-line no-new
new Router({
  target: document.querySelector("body"),
});
