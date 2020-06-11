<div
  bind:this={references.container}
  class="container"
  class:ready={isReady}
  class:filtered={isFiltered}
  on:scroll="{debounce(onScroll, 100)}"
  use:restoreScroll>

  {#if isFiltered}
    <div bind:this={references.unfilter} class="unfilter">
      <Button label="Unfilter" on:click="{unfilter}" />
    </div>
  {/if}

  {#if $filter && $feeds[$filter]}
    <div class="header">
      <Header aside={`last published: ${published}`}>
        <h2
          bind:this={references.heading}
          class="heading"
          class:filtered={isFiltered}>

          {@html $feeds[$filter].title}
        </h2>
      </Header>
    </div>
  {/if}

  {#if isFiltered}
    <div bind:this={references.unsubscribe} class="unsubscribe">
      <Button
        bind:isConfirming={isUnsubscribeConfirming}
        isDangerous={true}
        isRequiresConfirmation={true}
        label="Unsubscribe"
        on:click="{unsubscribe}" />
    </div>
  {/if}

  {#if items.length}
    <ul bind:this={references.feed} class="feed">
      {#each items as item, index (item.id)}
        {#if item.isDate}
          <li class="date-container" class:filtered={$filter && $feeds[$filter]}>
            {#if $filter && $feeds[$filter]}
              <h3 class="date">
                {item.id}
              </h3>
            {:else}
              <Header aside={index === 0 ? $updated.relative : ""}>
                <h3>
                  {item.id}
                </h3>
              </Header>
            {/if}
          </li>
        {:else}
          <li class:filtered={isFiltered}>
            <FeedLink
              bind:this={references[item.id]}
              color={item.color}
              favicon={item.favicon}
              href={item.url}
              label={item.title}
              selected={$article === item.id}
              on:click={partial(openArticle, item)} />
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
</div>

<style>
  .container {
    --scroll-margin-left: calc(var(--spacing-small) * 2);

    grid-area: articles;
    overflow-y: auto;
    padding-right: var(--spacing-medium);
    padding-top: var(--spacing-large);
    scroll-margin-left: var(--scroll-margin-left);
    scroll-snap-align: start;
    scroll-snap-margin-left: var(--scroll-margin-left);
    scroll-snap-type: inline mandatory;
    visibility: hidden;

    &.filtered {
      grid-template-rows: max-content;
    }

    &.ready {
      visibility: visible;
    }

    & > :last-child {
      padding-bottom: calc(var(--spacing-small) * 2);
    }

    @media (--medium) {
      --scroll-margin-left: var(--spacing-small);

      padding-left: var(--spacing-small);
      scroll-snap-align: end;
    }

    @media (--small) {
      --scroll-margin-left: var(--spacing-small);

      padding-left: 0px;
      padding-right: 0px;
      padding-top: var(--spacing-small);
      scroll-snap-align: start;
      width: calc(100% - var(--spacing-small) * 2);
    }
  }

  .unfilter {
    --border-style: dashed;

    font-weight: 700;
    margin-bottom: var(--spacing-small);
    margin-left: auto;
    margin-right: auto;
    width: max-content;
  }

  .unsubscribe {
    margin-bottom: var(--spacing-small);
    margin-left: auto;
    margin-right: auto;
    width: max-content;
  }

  .header {
    margin-bottom: var(--spacing-medium);
  }

  .feed {
    list-style-type: none;
  }

  .date-container {
    padding-bottom: var(--spacing-medium);
  }

  .date {
    font-family: var(--font-sans-serif);
    font-size: 36px;
    margin-left: auto;
    margin-right: auto;
    padding: var(--spacing-tiny) var(--spacing-small);
    text-align: center;
    text-shadow: var(--text-shadow);
    text-transform: lowercase;
    transition: border-color var(--transition-custom-color);
    width: max-content;
  }
</style>

<script context="module">
  import { writable } from "library/store";
  import { on, emit } from "library/events";

  const store = writable({}, {
    adapter: "ls",
    name: "views/app/articles",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import article from "stores/article";
  import articles from "stores/articles";
  import Button from "components/button";
  import dayjs from "dayjs";
  import debounce from "library/debounce";
  import debug from "debug";
  import feed from "stores/feed";
  import FeedLink from "components/feed-link";
  import feeds from "stores/feeds";
  import filter from "stores/filter";
  import getRelativeDate from "./get-relative-date";
  import Header from "components/header";
  import partial from "library/partial";
  import updated from "stores/updated";
  import { createEventDispatcher, tick } from "svelte";

  const dispatch = createEventDispatcher();
  const references = {};
  let isFiltered;
  let isReady;
  let isRemoving;
  let isUnsubscribeConfirming;
  let items = [];
  let published;

  $: published = isFiltered && $feeds[$filter].published
    ? getRelativeDate($feeds[$filter].published)
    : "?";

  $: {
    isFiltered = $filter && $feeds[$filter];
  }

  $: items = Object
    .values($articles)
    .filter(article$ => ($filter ? article$.feed === $filter : true))
    .sort((a, b) => (a.published > b.published ? -1 : 0))
    .reduce(addDates, {});

  $: {
    /* eslint-disable no-unused-expressions */

    // Both `$feed` and `$filter` because unfiltering may not
    // be a feed change if the last selected article belongs
    // to the same feed as the one that was unfiltered.
    $feed;
    $filter;
    restoreArticle();
    restoreScroll();
  }

  on("articles.add", articles$ => {
    articles$.forEach(article$ => {
      const isDuplicate = Object
        .values($articles)
        .find(({ feed, url }) => feed === article$.feed && url === article$.url);

      if (isDuplicate) {
        return;
      }

      $articles[article$.id] = article$;
    });
  });

  on("articles.remove", ids => {
    ids.forEach(id => {
      delete $articles[id];
    });

    $articles = $articles;
  });

  async function restoreScroll(container = references.container) {
    if (!container) {
      return;
    }

    await articles.ready;
    await feeds.ready;
    await tick();

    // Prevents scrollbar flash after setting `scrollTop`.
    container.style.overflow = "hidden";

    if ($filter && $feeds[$filter] && $feeds[$filter].y !== undefined) {
      container.scrollTop = $feeds[$filter].y;
    } else if (!$filter) {
      container.scrollTop = $store.y;
    }

    isReady = true;

    setTimeout(() => {
      container.style.overflow = "";
    });
  }

  async function onScroll() {
    // If the container's `scrollTop` is greater than 0
    // and a feed was just removed, then `scroll` was
    // caused by its removal. So we skip updating the store.
    if (isRemoving && references.container.scrollTop > 0) {
      isRemoving = false;
      return;
    }

    isRemoving = false;
    await feeds.ready;

    // TODO: where else can this happen?👇 also say how
    // an onscroll can happenw hen it's been removed.

    // A navigation could have happened between `feeds.ready`
    // and now, and `references.container` may no longer be
    // on the page.
    if (!references.container) {
      return;
    }

    if ($filter) {
      $feeds[$feed].y = references.container.scrollTop;
    } else {
      $store.y = references.container.scrollTop;
    }
  }

  function restoreArticle() {
    if (!$filter && $store.article) {
      $article = $store.article;
      $feed = $store.feed;
    }
  }

  async function openArticle(article$) {
    $article = article$.id;
    $feed = article$.feed;

    if ($filter) {
      $feeds[$feed].selected = article$.id;
    } else {
      $store.article = $article;
      $store.feed = $feed;
    }

    dispatch("select");
  }

  function unsubscribe() {
    if (!isUnsubscribeConfirming) {
      return;
    }

    isRemoving = true;

    Object
      .values($articles)
      .forEach(article$ => {
        if (article$.feed === $filter) {
          delete $articles[article$.id];
        }
      });

    $articles = $articles;
    emit("feed.remove", $filter);
  }

  function unfilter() {
    $feed = "";
    $filter = "";
  }

  function addDates(state, article, index, articles) {
    if (index === 0) {
      state.articles = [];
      state.dates = new Set();
    }

    const isToday = dayjs().isSame(article.published, "day");

    if (isToday) {
      if (!state.dates.has("Today")) {
        state.articles.push({
          id: "Today",
          isDate: true,
        });

        state.dates.add("Today");
      }

      state.articles.push(article);

      return index === articles.length - 1
        ? state.articles
        : state;
    }

    const yesterday = dayjs().subtract(1, "day");
    const isYesterday = dayjs(article.published).isSame(yesterday, "day");

    if (isYesterday) {
      if (!state.dates.has("Yesterday")) {
        state.articles.push({
          id: "Yesterday",
          isDate: true,
        });

        state.dates.add("Yesterday");
      }

      state.articles.push(article);

      return index === articles.length - 1
        ? state.articles
        : state;
    }

    const recent = dayjs().subtract(7, "day");
    const isRecent = dayjs(article.published).isAfter(recent);

    if (isRecent) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = days[dayjs(article.published).day()];

      if (!state.dates.has(day)) {
        state.articles.push({
          id: day,
          isDate: true,
        });

        state.dates.add(day);
      }

      state.articles.push(article);

      return index === articles.length - 1
        ? state.articles
        : state;
    }

    const date = new Date(article.published)
      .toLocaleDateString(navigator.language, {
        day: "numeric",
        month: "long",
      });

    if (!state.dates.has(date)) {
      state.articles.push({
        id: date,
        isDate: true,
      });

      state.dates.add(date);
    }

    state.articles.push(article);

    return index === articles.length - 1
      ? state.articles
      : state;
  }
</script>
