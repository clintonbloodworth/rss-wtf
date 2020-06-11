import "jobs/alive";
import "jobs/articles";
import "jobs/feeds";
import "jobs/prune";
import "jobs/sync";
import "jobs/updated";
import Router from "router";

window.navigator.serviceWorker.register("/worker.js");

// eslint-disable-next-line no-new
new Router({
  target: document.querySelector("body"),
});
