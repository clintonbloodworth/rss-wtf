<div
  bind:this={references.container}
  class="container"
  class:ready={isReady}
  class:filtered={isFiltered}
  on:focusin={onFocusin}
  on:scroll="{debounce(onScroll, 100)}"
  use:restoreScroll>

  <Heading>
    <h2
      bind:this={references.heading}
      class="heading"
      class:filtered={isFiltered}>

      {#if isFiltered}
        {@html $feeds[$filter].title}
      {:else}
        Articles
      {/if}
    </h2>
  </Heading>

  {#if items.length}
    <ul bind:this={references.feed} class="feed">
      {#each items as item, index (item.id)}
        {#if item.isDate}
          <li
            bind:this={references.date}
            class="date-container"
            class:filtered={isFiltered}>

            <h3 class="date">
              {item.date}
            </h3>
          </li>
        {:else}
          <li class="article" class:filtered={isFiltered} style="--offset: {item.offset};">
            <FeedLink
              bind:this={references[item.id]}
              color={item.color}
              favicon={item.favicon}
              href={item.url}
              label={item.title}
              selected="{$article === item.id}"
              on:click="{partial(openArticle, item)}" />
          </li>
        {/if}
      {/each}
    </ul>
  {/if}

  {#if isFiltered}
    <div bind:this={references.unsubscribe} class="unsubscribe">
      <Button
        bind:isConfirming={isUnsubscribeConfirming}
        isRequiresConfirmation={true}
        label="Unsubscribe"
        on:click="{unsubscribe}" />
    </div>
  {/if}
</div>

<style>
  .container {
    --grid-gap: var(--spacing-small);
    --scroll-margin-left: calc(var(--spacing-small) * 2);

    grid-area: feed;
    overflow-y: auto;
    padding-left: var(--focus-outline-width);
    padding-right: calc(var(--spacing-small) * 2);
    scroll-margin-left: var(--scroll-margin-left);
    scroll-snap-align: start;
    scroll-snap-margin-left: var(--scroll-margin-left); /* https://bugs.webkit.org/show_bug.cgi?id=189265 */
    scroll-snap-type: inline mandatory;
    visibility: hidden;

    &.filtered {
      grid-template-rows: max-content;
      padding-top: 0;
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

      padding-left: var(--spacing-small);
      padding-right: var(--spacing-small);
      scroll-margin-left: var(--scroll-margin-left);
      scroll-snap-align: start;
      scroll-snap-margin-left: var(--scroll-margin-left); /* https://bugs.webkit.org/show_bug.cgi?id=189265 */
      width: calc(100% - var(--spacing-small) * 2);
    }
  }

  .unsubscribe {
    display: grid;
    grid-gap: var(--spacing-small);
    grid-template-columns: 1fr;

    @media (--small) {
      grid-template-columns: 100%;
      margin-top: calc(var(--spacing-small) * 2);
    }
  }

  .heading {
    padding-bottom: var(--spacing-medium);
    padding-top: calc(var(--spacing-small) + var(--spacing-large));
    scroll-snap-align: start;

    &.filtered {
      position: sticky;
      top: 0px;
    }
  }

  .feed {
    /*
      Safari aggressively limits `position: sticky` elements within a
      `relative` parent. After some limit, it'll start treating sticky
      children as though they were statically positioned. Before that,
      however, it'll treat nested children belonging to the same parent
      as though they were static. It'll apparently do this in document
      order.

      Remove `display: contents` and scroll down a long list of articles.
      Watch how `.heading` is treated as `static` after ten or so articles
      are sticky. That's what `display: contents` fixes.
    */
    display: contents;
    list-style-type: none;
  }

  .article {
    &.filtered {
      position: sticky;
      top: calc(var(--heading-height) + var(--date-height) + var(--spacing-tiny) + var(--offset) * 2px);
    }
  }

  .date-container {
    padding-bottom: var(--spacing-medium);
    position: sticky;
    top: calc(var(--spacing-small) * 2);

    &.filtered {
      top: var(--heading-height);
    }
  }

  .date {
    background-color: rgb(var(--color-background));
    border: var(--border-width) dashed var(--color-custom, var(--color-border));
    border-radius: var(--border-radius-small);
    font-family: var(--font-sans-serif);
    font-size: var(--font-size-small);
    margin-left: auto;
    margin-right: auto;
    padding: var(--spacing-tiny) var(--spacing-small);
    text-align: center;
    text-shadow: var(--text-shadow);
    text-transform: uppercase;
    text-transform: lowercase;
    top: var(--spacing-large);
    transition: border-color var(--transition-custom-color);
    width: max-content;
  }
</style>

<script context="module">
  import writable from "library/writable";
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
  import debounce from "library/debounce";
  import debug from "debug";
  import feed from "stores/feed";
  import FeedLink from "components/feed-link";
  import feeds from "stores/feeds";
  import filter from "stores/filter";
  import Heading from "mixins/heading";
  import isThisWeek from "date-fns/isThisWeek";
  import partial from "library/partial";
  import { createEventDispatcher, tick } from "svelte";

  const dispatch = createEventDispatcher();
  const log = debug("components/feed");
  const references = {};
  let activeElement;
  let isFiltered;
  let isReady;
  let items = [];
  let isRemoving;
  let isUnsubscribeConfirming;

  on("articles.add", articles$ => {
    articles$.forEach(article$ => {
      const isDuplicate = Object
        .values($articles)
        .find(({ url }) => url === article$.url);

      if (isDuplicate) {
        return;
      }

      $articles[article$.id] = article$;
    });
  });

  on("articles.remove", feed => {
    Object
      .values($articles)
      .filter(article$ => article$.feed === feed)
      .forEach(article$ => {
        delete $articles[article$.id];
      });

    $articles = $articles;
  });

  // TODO: consider storing $articles as array isntead of object

  const done = new Set();

  const pastWeek = new Array(7)
    .fill(undefined)
    .map((_, index) => {
      const date = new Date();
      date.setTime(date.getTime() - (24 * 60 * 60 * 1000) * (index + 2));

      return {
        day: {
          name: date.toLocaleDateString("en-US", { weekday: "long" }),
          number: date.getDate(),
        },
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    });

  const pastYear = new Array(12).fill(undefined).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index);

    return {
      month: {
        name: date.toLocaleDateString("en-US", { month: "long" }),
        number: date.getMonth(),
      },
      year: date.getFullYear(),
    };
  });

  $: {
    isFiltered = $filter && $feeds[$filter];
  }

  $: items = Object
    .values($articles)
    .filter(article$ => ($filter ? article$.feed === $filter : true))
    .sort((a, b) => (a.published > b.published ? -1 : 0))
    .flatMap(shit);

  $: {
    /* eslint-disable no-unused-expressions */
    references.heading;
    setHeights();
  }

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

  $: {
    if (Object.keys($feeds).length === 1) {
      const [feed$] = Object.keys($feeds);
      $feed = feed$;
      $filter = feed$;
    }
  }

  function shit(article, index) {
    const currentDate = new Date();
    const articleDate = new Date(article.published);
    const today = `${currentDate.getDate()}${currentDate.getMonth()}${currentDate.getFullYear()}`;
    const yesterday = `${currentDate.getDate() - 1}${currentDate.getMonth()}${currentDate.getFullYear()}`;
    const monday = `${currentDate.getDate() - 2}${currentDate.getMonth()}${currentDate.getFullYear()}`;
    const no = `${articleDate.getDate()}${articleDate.getMonth()}${articleDate.getFullYear()}`;

    if (index === 0) {
      done.clear();
    }

    article.isDate = false;
    article.offset = index;

    if (no === today) {
      if (!done.has("Today")) {
        done.add("Today");

        return [{
          color: article.color,
          date: "Today",
          get id() {
            return this.date;
          },
          isDate: true,
        }, article];
      }

      return article;
    }

    if (no === yesterday) {
      if (!done.has("Yesterday")) {
        done.add("Yesterday");
        article.offset = index;

        return [{
          color: article.color,
          date: "Yesterday",
          get id() {
            return this.date;
          },
          isDate: true,
        }, article];
      }

      return article;
    }

    const weekday = pastWeek.find(date => {
      return isThisWeek(articleDate, { weekStartsOn: 1 })
        && date.day.number === articleDate.getDate()
        && date.month === articleDate.getMonth()
        && date.year === articleDate.getFullYear();
    });

    if (weekday) {
      if (!done.has(weekday.day.name)) {
        done.add(weekday.day.name);
        article.offset = index;

        return [{
          color: article.color,
          date: weekday.day.name,
          get id() {
            return this.date;
          },
          isDate: true,
        }, article];
      }

      return article;
    }

    const month = pastYear.find(date => {
      return date.month.number === articleDate.getMonth()
        && date.year === articleDate.getFullYear();
    });

    if (month) {
      if (!done.has(month.name)) {
        done.add(month.name);
        article.offset = index;

        return [{
          color: article.color,
          date: currentDate.getMonth() === month.month.number
            ? "This Month"
            : month.month.name,
          get id() {
            return this.date;
          },
          isDate: true,
        }, article];
      }

      return article;
    }

    return article;
  }

  async function setHeights() {
    await tick();

    if (references.heading) {
      const { height } = references.heading.getBoundingClientRect();
      references.container.style.setProperty("--heading-height", `${height}px`);
    }

    if (references.date) {
      const { height } = references.date.getBoundingClientRect();
      references.container.style.setProperty("--date-height", `${height}px`);
    }

    if (references.unsubscribe) {
      const { height } = references.unsubscribe.getBoundingClientRect();
      references.container.style.setProperty("--unsubscribe-height", `${height}px`);
    }
  }

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
    } else if ($filter) {
      const { height } = references.unsubscribe.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      const gridGap = parseInt(styles.getPropertyValue("--grid-gap"), 10);
      container.scrollTop = height + gridGap;
    } else {
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

  function onFocusin(event) {
    activeElement = event.target;
    dispatch("focus");
  }

  function focus() {
    // TODO: even if unsubscribe was the last focused element for
    // one feed, it shouldn't be focused for the current. so i
    // need to store focus per feed.
    if (activeElement && activeElement.isConnected) {
      activeElement.focus({
        preventScroll: true,
      });
      // TODO: why? not because of the app
      // but because the brower and user came clear
    } else if (references[$article]) {
      references[$article].focus({
        preventScroll: true,
      });
    } else if ($filter) {
      references.unsubscribe.focus({
        preventScroll: true,
      });
    }
  }

  export {
    focus,
  };
</script>
