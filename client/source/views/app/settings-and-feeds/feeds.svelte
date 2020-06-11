{#if feeds$.length}
  <Heading>
    <h2>
      Feeds
    </h2>
  </Heading>

  <ul bind:this={references.feeds} class:feeds={feeds$.length}>
    {#each feeds$ as feed$, index (feed$.url)}
      <li>
        <FeedLink
          bind:this={references[feed$.url]}
          color={feed$.color}
          favicon={feed$.favicon}
          isHidden={feed$.isHidden}
          label={feed$.title}
          selected="{$filter === feed$.url}"
          href="{feed$.home}"
          on:click="{partial(filter$, feed$.url)}" />
      </li>
    {/each}
  </ul>
{/if}

<style>
  h2 {
    scroll-margin-top: calc(var(--spacing-small) + var(--spacing-large));
    scroll-snap-align: start;
  }

  ul {
    display: grid;
    grid-auto-rows: max-content;
    scroll-margin-top: var(--spacing-large);
    scroll-padding-left: var(--spacing-large);

    &.feeds {
      scroll-snap-align: start;
    }
  }

  li {
    list-style-type: none;
  }
</style>

<script context="module">
  import { on } from "library/events";
  import writable from "library/writable";

  const store = writable({
    history: [],
  }, {
    adapter: "ls",
    name: "views/app/settings-and-feeds/feeds",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import article from "stores/article";
  import articles from "stores/articles";
  import debounce from "library/debounce";
  import debug from "debug";
  import feed from "stores/feed";
  import FeedLink from "components/feed-link";
  import feeds from "stores/feeds";
  import filter from "stores/filter";
  import Heading from "mixins/heading";
  import partial from "library/partial";
  import { createEventDispatcher, onMount, tick } from "svelte";

  const dispatch = createEventDispatcher();
  const references = {};
  let activeElement;

  on("feed.add", async feed => {
    if ($feeds[feed.url]) {
      return;
    }

    feed.updated = new Date().toISOString();
    $feeds[feed.url] = feed;
    $feeds[feed.url].isHidden = true;
    await tick();
    await references[feed.url].show();
    $feeds[feed.url].isHidden = false;
  });

  on("feed.remove", async url => {
    if ($feeds[feed.url]) {
      return;
    }

    await references[url].hide();
    delete $feeds[url];
    $feeds = $feeds;
    $store.history = $store.history.filter(url$ => url$ !== url);

    if ($store.history.length) {
      const url = $store.history.pop();
      $feed = url;
      $filter = url;
    } else {
      $feed = "";
      $filter = "";
    }
  });

  $: feeds$ = Object
    .values($feeds)
    .sort((a, b) => (a.title < b.title ? -1 : 0));

  $: {
    /* eslint-disable no-unused-expressions */
    $filter;
    updateHistory();
  }

  onMount(async () => {
    await feeds.ready;

    for (const feed of Object.values($feeds)) {
      // It's unlikely but posssible for the addition of a feed
      // to be interupted partway through it's animation. For
      // example, if the page is refreshed. Who knows. But, if
      // something stops it, then `isHidden` will always be `true`
      // and the feed will never appear. Thus this check.
      if (feed.isHidden) {
        $feeds[feed.url].isHidden = false;
      }
    }
  });

  function filter$(filter$) {
    if ($filter === filter$ && Object.keys($feeds).length > 1) {
      $article = "";
      $feed = "";
      $filter = "";
    } else {
      $feed = filter$;
      $filter = filter$;
      const { selected } = $feeds[filter$];

      if (selected && $articles[selected]) {
        $article = selected;
      } else {
        $article = "";
      }
    }

    dispatch("select");
  }

  function updateHistory() {
    if (!$store.history) {
      $store.history = [];
    }

    const [lastFilter] = $store.history.slice(-1);

    if (lastFilter !== $filter) {
      $store.history = $store.history.concat($filter);
    }

    // TODO: why 5?
    if ($store.history.length > 5) {
      $store.history = $store.history.slice(1);
    }
  }
</script>
