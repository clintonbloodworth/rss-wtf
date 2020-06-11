import debug from "debug";
import userbase from "library/userbase";
import state from "./state";
const log = debug("jobs/sync/open-database")

export default () => {
  log("opening database");

  return new Promise((resolve, reject) => {
    userbase.openDatabase("feeds", items => {
      const urls = items.map(item => item.item);
      log("on server", urls);

      for (const url of urls) {
        state.server.add(url);
        addToClient(url);
      }

      for (const url of state.server.values()) {
        if (!urls.includes(url) && !state.addingToServer.has(url)) {
          state.server.delete(url);
          removeFromClient(url);
          log("removed from server", url);
        }
      }

      log("server ready");
      resolve();
    }).catch(reject);
  });
  }
