<svelte:window on:keydown="{onKeydown}" />

<div
  bind:this="{references.app}"
  class="app"
  class:ready={isReady}
  on:focusin={onFocusIn}
  on:scroll="{debounce(onScroll, 100)}"
  use:restoreScroll
  tabindex="-1">

  <VisuallyHidden>
    <h1>App</h1>
  </VisuallyHidden>

  <SettingsAndFeeds 
    bind:this={references["settings-and-feeds"]}
    on:focus={partial(onFocus, "settings-and-feeds")} 
    on:select={partial(scrollRight, "settings-and-feeds")} />

  <Articles
    bind:this={references.articles}
    on:focus={partial(onFocus, "articles")}
    on:select={partial(scrollRight, "articles")} />

  <Article
    bind:this="{references.article}"
    on:focus={partial(onFocus, "article")} />
</div>

<style>
  .app {
    --padding-left: max(calc(var(--spacing-small) * 2), var(--focus-outline-width));

    display: grid;
    grid-template-areas: "settings-and-feeds feed article";
    grid-template-columns: 375px 440px 100vw;
    grid-template-rows: minmax(0, 100%);
    overflow-x: auto;
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
</style>

<script context="module">
  import { on } from "library/events";
  import writable from "library/writable";

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
  import breakpoints from "library/breakpoints";
  import debounce from "library/debounce";
  import feeds from "stores/feeds";
  import partial from "library/partial";
  import SettingsAndFeeds from "./settings-and-feeds";
  import VisuallyHidden from "mixins/visually-hidden";
  import { isScrollBehavior } from "library/features";
  import { tick } from "svelte";

  const references = {};
  let activeComponent;
  let focusElement;
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

  function onFocus(component) {
    activeComponent = component;
  }

  function onFocusIn(event) {
    focusElement = event.target;
  }

  function onKeydown(event) {
    if (focusElement && (focusElement.tagName === "INPUT" || focusElement.tagName === "TEXTAREA")) {
      return;
    }

    const components = ["settings-and-feeds", "articles", "article"];
    const index = components.indexOf(activeComponent);

    if (event.key === "ArrowLeft") {
      const component = index === 0
        ? components[index]
        : components[index - 1];

      if (component === "settings-and-feeds") {
        if (focusElement) {
          const { height, top } = focusElement.getBoundingClientRect();
          references[component].focus(top + (height / 2));
        } else {
          references[component].focus();
        }
      } else {
        references[component].focus();
      }

      activeComponent = component;
    } else if (event.key === "ArrowRight") {
      const component = index === components.length - 1
        ? components[index]
        : components[index + 1];

      if (component) {
        activeComponent = component;
        references[component].focus();
      }
    }
  }

  async function scrollRight(component) {
    const isMedium = window.matchMedia(breakpoints["--medium"]).matches;
    const isSmall = window.matchMedia(breakpoints["--small"]).matches;
    const left = references.app.scrollLeft + window.innerWidth;

    if ((!isMedium && !isSmall) || (!isSmall && isMedium && component !== "articles")) {
      return;
    }

    if (await isScrollBehavior) {
      references.app.scrollTo({
        behavior: "smooth",
        left,
      });
    } else {
      references.app.scrollTo(left);
    }
  }
</script>
