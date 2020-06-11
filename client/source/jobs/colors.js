import { get } from "svelte/store";
import { on } from "library/events";
import idleCallback from "library/idle-callback";
import articles from "stores/articles";
import feeds from "stores/feeds";

on("feed.add", feed => {
  idleCallback.request(async () => {
    const img = document.createElement("img");

    // Prevents "Unable to get image data from canvas because
    // the canvas has been tainted by cross-origin data". Color
    // Thief uses canvas.
    img.crossOrigin = "anonymous";
    img.src = feed.favicon;

    img.onload = async () => {
      let color;

      try {
        const module = await import("colorthief/dist/color-thief.mjs");
        const colorThief = new module.default(); // eslint-disable-line new-cap

        // TODO: use getPalette instead, hopefully getting a light and dark color.
        color = colorThief.getColor(img);
      } catch {}

      if (!color) {
        return;
      }

      const $articles = get(articles);
      const $feeds = get(feeds);
      color = color.join(",");
      $feeds[feed.url].color = color;
      feeds.set($feeds);

      for (const article of Object.values($articles)) {
        if (article.feed === feed.url) {
          $articles[article.id].color = color;
        }
      }

      articles.set($articles);
    };
  });
});
