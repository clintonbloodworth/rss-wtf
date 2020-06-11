import "jobs/alive";
import "jobs/articles";
import "jobs/colors";
import "jobs/feeds";
import "jobs/prune";
import "jobs/sync";
import debug from "debug";
import Router from "router";

window.navigator.serviceWorker.register("/worker.js");

if (process.env.NODE_ENV === "development") {
  debug.enable("*");
  window.debug = debug;
}

// eslint-disable-next-line no-new
new Router({
  target: document.querySelector("body"),
});
