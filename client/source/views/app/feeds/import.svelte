<div class="container">
  <Button>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <!-- https://github.com/sveltejs/svelte/issues/5528 -->

    <label class:disabled={$isOffline} tabindex="0">
      Import

      <VisuallyHidden>
        <input
          accept=".opml, .xml, application/xml, text/x-opml, text/xml"
          bind:this="{references.import}"
          disabled={$isOffline}
          on:change="{import$}"
          tabindex="-1"
          type="file" />
      </VisuallyHidden>
    </label>
  </Button>
</div>

<style>
  .container {
    margin-bottom: var(--spacing-small);
  }
</style>

<script context="module">
  import { writable } from "library/store";
  import { on, emit } from "library/events";

  const store = writable([], {
    adapter: "ls",
    name: "views/app/settings-and-feeds/settings/",
  });

  on("reset", () => {
    store.set([]);
  });
</script>

<script>
  import feeds from "stores/feeds";
  import endpoints from "library/endpoints";
  import Button from "mixins/button";
  import VisuallyHidden from "mixins/visually-hidden";
  import isOffline from "stores/offline";
  import { onMount } from "svelte";

  const references = {};
  let errors = [];
  let index;
  let isCancel;
  let isImporting;
  let message;
  let skip;
  let urls = [];

  onMount(async () => {
    if ($store.length) {
      addFeeds($store);
    }
  });

  async function import$(event) {
    const xml = await references.import.files[0].text();
    const parser = new DOMParser();
    const document$ = parser.parseFromString(xml, "text/xml");
    const outlines = document$.querySelectorAll("outline");
    urls = [];

    for (const outline of outlines) {
      const type = outline.getAttribute("type");
      const isRss = type && type.toLowerCase() === "rss";
      const url = outline.getAttribute("xmlUrl");

      if (isRss && url) {
        urls.push(url);
      }
    }

    isCancel = false;
    urls = urls.filter(url => !Object.keys($feeds).includes(url));
    $store = $store.concat(urls);
    isImporting = true;
    index = 0;
    next();

    for await (const [url, error] of addFeeds()) {
      index += 1;

      if (isCancel) {
        break;
      } else if (error) {
        // if (error.name !== "AbortError") {
        errors.push(url);
        // }
      } else {
        $store = $store.filter(feed => !url);
      }
    }

    isImporting = false;
    errors = errors;
    next();
  }

  async function* addFeeds() {
    for await (const url of urls) {
      let request = endpoints.feeds({
        query: {
          url,
        },
      });

      skip = request.abort;
      let feed;

      try {
        [feed] = await request;
      } catch (error) {
        yield [url, error];
        console.log(url, error);
        continue;
      }

      request = endpoints.articles({
        query: {
          url,
        },
      });

      skip = request.abort;
      let articles;

      try {
        articles = await request;
      } catch (error) {
        yield [url, error];
        continue;
      }

      emit("articles.add", articles);
      emit("feed.add", feed);
      yield [url];
    }
  }

  function openErrorsModal() {
    console.log("errors modal");
  }
</script>
