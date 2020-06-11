import sAgo from "s-ago";
import { get } from "svelte/store";
import updated from "stores/updated";

(function job() {
  const $updated = get(updated);
  const date = new Date($updated.absolute);

  updated.set({
    ...$updated,
    relative: `Updated: ${sAgo(date)}`,
  });

  setTimeout(job, 30000);
}());
