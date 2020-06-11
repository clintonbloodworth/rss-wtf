<div 
  bind:this="{references.container}" 
  class="container" 
  on:focusin={onFocusin}
  on:scroll="{debounce(onScroll, 100)}"
  use:restoreScroll
  tabindex="-1">

  <Settings />
  <Feeds on:select />
</div>

<style>
  .container {
    --margin-left: max(calc(var(--spacing-small) * 2), var(--focus-outline-width));

    display: grid;
    grid-area: settings-and-feeds;
    grid-gap: var(--spacing-medium);
    grid-template-rows: repeat(7, max-content) 100%;
    overflow-y: auto;
    scroll-snap-margin-left: var(--margin-left);
    padding-left: var(--focus-outline-width);
    padding-right: calc(var(--spacing-small) * 2);
    scroll-margin-left: var(--margin-left);
    scroll-snap-align: start;
    scroll-snap-type: block proximity;

    /*
      This gives us a little grid gap at the bottom,
      which gives us a nice little gap when there's
      overflow.
    */

    &::after {
      content: "";
      height: 1px;
    }

    @media (--medium) {
      padding-left: var(--padding-left);
      padding-right: var(--spacing-small);
    }

    @media (--small) {
      width: calc(100% - var(--spacing-small) * 2);
    }
  }
</style>

<script context="module">
  import { on } from "library/events";
  import writable from "library/writable";

  const store = writable({}, {
    adapter: "ls",
    name: "views/app/settings-and-feeds",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import Feeds from "./feeds";
  import Settings from "./settings";
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { isChrome } from "library/browser";
  import debounce from "library/debounce";
  import articles from "stores/articles";
  import feeds from "stores/feeds";

  const dispatch = createEventDispatcher();
  const references = {};
  let activeElement;

  function onFocusin(event) {
    activeElement = event.target;
    dispatch("focus");
  }

  function focus(center) {
    const focusElement = activeElement || getFocusElement(center);

    if (!focusElement) {
      return;
    }

    // TODO: why?
    focusElement.focus({
      preventScroll: true,
    });

    // TODO: explain
    if (isChrome && focusElement.tagName === "INPUT") {
      references.container.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  function getFocusElement(center = 0) {
    return Array
      .from(references.container.querySelectorAll([
        "a",
        "button",
        "details",
        "input",
        "select",
        "textarea",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",")))
      .map(element => {
        const { height, top } = element.getBoundingClientRect();

        return {
          element,
          height,
          top,
        };
      })
      .filter(({ element, height, top }) => {
        return !element.hasAttribute("disabled") && top > 0;
      })
      .sort((a, b) => {
        return Math.abs(a.top + (a.height / 2) - center) < Math.abs(b.top - (b.height / 2) - center)
          ? -1
          : 1;
      })
      .map(({ element }) => element)
      .shift();
  }

  function onScroll(event) {
    $store.x = event.target.scrollLeft;
    $store.y = event.target.scrollTop;
  }

  async function restoreScroll(container) {
    await feeds.ready;
    await tick();

    container.style.overflow = "hidden"; // Prevents scrollbar flash after setting `scrollTop`.
    container.scrollLeft = $store.x;
    container.scrollTop = $store.y;

    setTimeout(() => {
      container.style.overflow = "";
    });
  }

  export {
    focus,
  };
</script>
