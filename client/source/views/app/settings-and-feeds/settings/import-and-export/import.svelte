<Button>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <!-- https://github.com/sveltejs/svelte/issues/5528 -->

  <label class:disabled={$isOffline} tabindex="0">
    Import

    <!-- `tabindex="-1"` because it's visually hidden. -->
    <VisuallyHidden>
      <input
        accept=".opml, .xml, application/xml, text/x-opml, text/xml"
        bind:this="{references.import}"
        disabled={$isOffline}
        on:change="{import$}"
        tabindex="-1"
        type="file" />
    </VisuallyHidden>
</Button>

<script context="module">
  import writable from "library/writable";
  import { on } from "library/events";

  const store = writable([], {
    adapter: "ls",
    name: "views/app/settings-and-feeds/settings/import-and-export", // Horrific.
  });

  on("reset", () => {
    store.set([]);
  });
</script>

<script>
  import Button from "mixins/button";
  import endpoints from "library/endpoints";
  import isOffline from "stores/offline";
  import VisuallyHidden from "mixins/visually-hidden";
  import { emit } from "library/events";

  if ($store.length) {
    addFeeds($store);
  }

  const references = {};

  async function import$(event) {
    console.log(event);
    const xml = await references.import.files[0].text();
    const parser = new DOMParser();
    const document$ = parser.parseFromString(xml, "text/xml");
    const outlines = document$.querySelectorAll("outline");
    const feeds = [];

    for (const outline of outlines) {
      const type = outline.getAttribute("type");
      const isRss = type && type.toLowerCase() === "rss";

      if (isRss) {
        const url = outline.getAttribute("xmlUrl");
        feeds.push(url);
      }
    }

    const filtered = feeds.filter(feed => !$store.includes(feed));
    $store = $store.concat(filtered);

    for await (const [url, error] of addFeeds(filtered)) {
      if (error) {
        console.log(error);
      } else {
        $store = $store.filter(feed => !url);
      }
    }
  }

  async function* addFeeds(urls) {
    for await (const url of urls) {
      let feed;

      try {
        [feed] = await endpoints.feeds({
          query: {
            url,
          },
        });
      } catch (error) {
        yield [url, error];
        console.log(url, error);
        continue;
      }

      let articles;

      try {
        articles = await endpoints.articles({
          query: {
            url,
          },
        });
      } catch (error) {
        yield [url, error];
        continue;
      }

      emit("articles.add", articles);
      emit("feed.add", feed);
      yield [url];
    }
  }
</script>
