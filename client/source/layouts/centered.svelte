<div 
  bind:this={references.centered}
  class="container"
  class:transitioning={isTransitioning}
  on:scroll="{onScroll}">

  <div
    bind:this={references.slot}
    class="slot"
    class:resetting={isResetting}
    class:transitioning={isTransitioning}
    class:transitioned={isTransitioned}
    on:transitionend={onTransitionEnd}
    on:transitionstart={onTransitionStart}>
   

    <slot />
  </div>

  {#if error$}
    <p
      bind:this={references.error}
      class="error"
      class:resetting={isResetting}
      class:transitioning={isTransitioning}
      class:transitioned={isTransitioned}>

      {error$}
    </p>
  {/if}
</div>

<style>
  .container {
    --transition-duration: 200ms;

    height: max-content;
    margin: auto;
    max-height: 100%;
    overflow-y: auto;
    position: relative;
    width: 265px;

    &.transitioning {
      overflow-y: visible;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .slot {
    display: grid;
    grid-gap: var(--spacing-small);
    justify-content: center;
    padding-bottom: calc(var(--spacing-small) * 2);
    padding-top: calc(var(--spacing-small) * 2);
    position: relative;
    transform: var(--transform);
    transition: transform var(--transition-duration);
    z-index: 1;

    &.resetting {
      transform: var(--transform);
      transition: transform var(--transition-duration);
    }

    &.transitioned {
      transform: none;
      transition: none;
    }
  }

  .error {
    border-radius: var(--border-radius);
    bottom: 0px;
    color: var(--color-red);
    font-family: var(--font-sans-serif);
    font-size: var(--font-size-tiny);
    font-weight: 700;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    text-align: center;
    text-shadow: var(--text-shadow);
    text-transform: uppercase;
    transform: scaleY(0) rotate(30deg) translateY(50%);
    transform-origin: 50% 50%;
    visibility: hidden;
    width: 180px;

    &.resetting {
      position: static;
      transition: transform var(--transition-duration);
      visibility: visible;
    }

    &.transitioning {
      transform: scaleY(1) rotate(0deg) translateY(50%);
      transition: transform var(--transition-duration);
      visibility: visible;
    }

    &.transitioned {
      position: static;
      transform: none;
      transition: none;
      visibility: visible;
    }
  }
</style>

<script context="module">
  import { on } from "library/events";

  const stores = [];

  on("reset", () => {
    stores.forEach(store => {
      store.set({});
    });
  });
</script>

<script>
  import { writable } from "library/store";
  import { onMount, tick } from "svelte";

  const references = {};
  let error = null;
  let error$;
  let isResetting;
  let isTransitioned;
  let isTransitioning;
  let store$ = "";
  let store;
  let transition;

  $: {
    error; // eslint-disable-line no-unused-expressions
    transform();
  }

  if (store$) {
    store = writable({}, {
      adapter: "ls",
      name: store$,
    });

    stores.push(store);
  }

  onMount(() => {
    if (store$) {
      references.centered.scrollLeft = $store.x;
      references.centered.scrollTop = $store.y;
    }
  });

  function onTransitionStart(event) {
    if (event.target !== references.slot || isTransitioned) {
      return;
    }

    if (isResetting) {
      let resolve;

      transition = new Promise(resolve$ => {
        resolve = resolve$;
      });

      transition.resolve = resolve;
    } else {
      isTransitioning = true;
    }
  }

  async function onTransitionEnd(event) {
    if (event.target !== references.slot || isTransitioned) {
      return;
    }

    if (isResetting) {
      error$ = null;
      isResetting = false;
      transition.resolve();
    } else {
      isTransitioning = false;
    }

    isTransitioned = true;
    await tick();
    references.centered.scrollTop += references.centered.dataset.offset;
  }

  async function transform() {
    await transition;
    isTransitioned = false;

    if (error) {
      error$ = error;
      await tick();
      references.error.style.transform = "none";
      const { height } = references.error.getBoundingClientRect();
      references.error.style.transform = "";
      references.error.offsetHeight; // eslint-disable-line no-unused-expressions
      const offset = height / 2;
      references.centered.dataset.offset = offset;
      references.slot.style.setProperty("--transform", `translateY(-${offset}px)`);
    } else if (error$) {
      const { height } = references.error.getBoundingClientRect();
      const offset = height / 2;
      references.centered.dataset.offset = -offset;
      references.slot.style.setProperty("--transform", `translateY(${offset}px)`);
      isResetting = true;
    }
  }

  function onScroll(event) {
    if (store$) {
      $store.x = event.target.scrollLeft;
      $store.y = event.target.scrollTop;
    }
  }

  export {
    error,
    store$ as store,
  };
</script>
