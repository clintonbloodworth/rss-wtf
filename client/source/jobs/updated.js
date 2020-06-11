import sAgo from "s-ago";
import { get } from "svelte/store";
import updated from "stores/updated";

(function job() {
  const $updated = get(updated);

  const date = $updated.absolute
    ? sAgo(new Date($updated.absolute))
    : "?";

  updated.set({
    ...$updated,
    relative: `Updated: ${date}`,
  });

  setTimeout(job, 30000);
}());
