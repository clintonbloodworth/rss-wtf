<div
  bind:this="{references.app}"
  class="app"
  class:ready={isReady}
  on:scroll="{debounce(onScroll, 100)}"
  use:restoreScroll>

  <VisuallyHidden>
    <h1>App</h1>
  </VisuallyHidden>

  <div class="user-and-feeds">
    <Feeds />
    <User />
  </div>

  <Articles />
  <Article />
</div>

<style>
  .app {
    display: grid;
    grid-template-areas:
      "feeds articles article"
      "user articles article";
    grid-template-columns: 375px 450px 100vw;
    grid-template-rows: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding-left: var(--padding-left);
    position: relative;
    scroll-snap-type: inline mandatory;
    scrollbar-width: none;
    visibility: hidden;
    width: 100%;

    &.ready {
      visibility: visible;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    @media (--medium) {
      grid-template-columns: repeat(2, 50vw) minmax(100vw, 1fr);
      padding-left: 0px;
    }

    @media (--small) {
      grid-template-columns: repeat(3, 100vw);
    }
  }

  .user-and-feeds {
    --spacing-left: calc(var(--spacing-small) * 2);

    margin-left: var(--spacing-left);
    overflow-y: auto;
    padding-top: var(--spacing-large);
    scroll-margin-left: var(--spacing-left);
    scroll-snap-align: start;
    scroll-snap-margin-left: var(--spacing-left);  /* https://bugs.webkit.org/show_bug.cgi?id=189265 */
    scroll-snap-type: block proximity;
  }
</style>

<script context="module">
  import { on } from "library/events";
  import { writable } from "library/store";

  const store = writable({}, {
    adapter: "ls",
    name: "routes/app",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import Article from "./article";
  import Articles from "./articles";
  import articles from "stores/articles";
  import breakpoint from "stores/breakpoint";
  import debounce from "library/debounce";
  import feeds from "stores/feeds";
  import Feeds from "./feeds";
  import isStandalone from "stores/standalone";
  import partial from "library/partial";
  import User from "./user";
  import VisuallyHidden from "mixins/visually-hidden";
  import { isScrollBehavior } from "library/features";
  import { tick } from "svelte";

  const references = {};
  let isReady;

  async function restoreScroll(app) {
    await articles.ready;
    await feeds.ready;
    app.scroll({ left: $store.x });
    isReady = true;
  }

  function onScroll(event) {
    $store.x = event.target.scrollLeft;
  }
</script>
