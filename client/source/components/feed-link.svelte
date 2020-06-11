<div 
  bind:this={references.container} 
  class="container"
  class:hidden={isHidden}>

  <a
    {href}
    bind:this={references.link}
    class:selected={selected}
    draggable="false"
    on:click={onClick}
    on:pointerup
    style="--color-custom: rgb({color})"
    tabindex="0">

    {#if isFaviconError}
      <span class="favicon-fallback" class:loaded={isFaviconReady}>
        ★
      </span>
    {:else}
      <img
        alt=""
        bind:this={references.image}
        class:loaded={isFaviconReady}
        draggable="false"
        on:load={onFaviconLoad}
        on:error={onFaviconError}
        src="{favicon}">
    {/if}

    <span class="label">
      {@html label}
    </span>
  </a>
</div>

<style>
  .container {
    --transition-duration: 100ms;
    --height: 44px;
    --margin-bottom: var(--spacing-medium);

    height: calc(var(--height) + var(--margin-bottom));
    list-style-type: none;
    transition: opacity var(--transition-duration);

    &.hidden {
      height: 0px;
      opacity: 0;
      overflow: hidden;
    }
  }

  a {
    align-items: center;
    background-color: rgb(var(--color-background));
    border: var(--border-width) var(--border-style) var(--color-border);
    border-radius: var(--border-radius-small);
    box-shadow: var(--box-shadow);
    color: rgb(var(--color-foreground));
    display: flex;
    flex-shrink: 0;
    font-family: var(--font-sans-serif);
    font-size: var(--font-size-large);
    font-weight: 500;
    height: var(--height);
    margin-bottom: var(--margin-bottom);
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
    text-align: left;
    text-decoration: none;
    transition: 200ms box-shadow, 200ms transform;
    white-space: nowrap;
    width: 100%;

    &.selected {
      background-color: rgb(var(--color-background));
      color: rgb(var(--color-foreground));
      font-weight: 700;
    }

    &:active {
      box-shadow: none;
      transform: scale(0.99);
    }

    &:focus-visible {
      border-radius: var(--focus-outline-radius);
    }

    &:hover {
      background-color: rgb(var(--color-background));
      color: rgb(var(--color-foreground));
      text-decoration: none;
    }
  }

  .label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  img,
  .favicon-fallback {
    --size: 18px;

    display: block;
    flex-shrink: 0;
    height: var(--size);
    margin-right: var(--spacing-medium);
    opacity: 0;
    transition: opacity 200ms;
    width: var(--size);

    &.loaded {
      opacity: 1;
    }
  }

  .favicon-fallback {
    align-items: center;
    background-color: var(--color-custom);
    border-radius: 50%;
    color: rgb(var(--color-background));
    display: flex;
    font-size: var(--font-size-tiny);
    font-weight: 700;
    justify-content: center;
    line-height: 100%;
    transition: background-color var(--transition-custom-color);
  }
</style>

<script>
  import { createEventDispatcher, tick } from "svelte";
  import idleCallback from "library/idle-callback";

  // TODO: double-up text and fade in and out bold text
  // looks shitty now.

  const dispatch = createEventDispatcher();
  const references = {};
  let color;
  let favicon;
  let href;
  let isFaviconError;
  let isFaviconReady;
  let isHidden = false;
  let label;
  let selected;

  function onFaviconLoad() {
    idleCallback.request(() => {
      isFaviconReady = true;
    });
  }

  async function onFaviconError() {
    isFaviconError = true;
    await tick();

    idleCallback.request(() => {
      isFaviconReady = true;
    });
  }

  function onClick(event) {
    if (event.metaKey) {
      return;
    }

    event.preventDefault();
    dispatch("click");
  }

  function focus() {
    references.link.focus();
  }

  function hide() {
    return new Promise(resolve => {
      references.container.style.visibility = "hidden";
      const styles = window.getComputedStyle(references.container);
      const duration = parseInt(styles.getPropertyValue("--transition-duration"), 10);

      const animation = references.container.animate([
        { height: "0px" },
      ], { duration });

      animation.onfinish = resolve;
    });
  }

  function show() {
    return new Promise(resolve => {
      const styles = window.getComputedStyle(references.container);
      const duration = parseInt(styles.getPropertyValue("--transition-duration"), 10);
      const height = parseInt(styles.getPropertyValue("--height"), 10);
      const marginBottom = parseInt(styles.getPropertyValue("--margin-bottom"), 10);

      const animation = references.container.animate([
        { height: `${height + marginBottom}px` },
      ], { duration });

      animation.onfinish = () => {
        isHidden = false;
        resolve();
      };
    });
  }

  export {
    color,
    favicon,
    focus,
    hide,
    href,
    isHidden,
    label,
    selected,
    show,
  };
</script>
