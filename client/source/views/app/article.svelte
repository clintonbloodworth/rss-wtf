<svelte:window on:resize="{debounce(partial(setLeft, undefined), 50)}" />

{#if html}
  <!-- 
    This component's width is set to 100vw by its parent, which
    allows for distraction-free reading. However, we also want
    `.container` to stick to the center of the viewport when it's
    the only thing on the screen. And a 100vw `.container` would
    prevent this. Thus this classless DIV.
  -->
  <div>
    <div
      on:focusin={onFocusin}
      bind:this="{references.container}"
      on:scroll="{onScroll}"
      use:restoreScroll
      class="container"
      class:ready={isReady}
      tabindex="-1">

      <div 
        bind:this="{references.article}" 
        class="article"
        use:setLeft
        use:showImages={html}
        tabindex="0">

        <RichText>
          {@html html}
        </RichText>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    grid-area: article;
    height: 100%;
    overflow: hidden auto;
    position: sticky;
    scroll-snap-align: start;
    visibility: hidden;
    width: max-content;

    &.ready {
      scroll-behavior: smooth;
      visibility: visible;
    }

    @media (--medium) {
      padding-left: calc(var(--spacing-small) * 2);
      position: static !important;
      width: calc(100% - var(--spacing-small) * 2);
    }

    @media (--small) {
      --scroll-margin-left: var(--spacing-small);

      padding-left: var(--spacing-small);
      padding-right: var(--spacing-small);
      scroll-snap-margin-left: var(--scroll-margin-left); /* https://bugs.webkit.org/show_bug.cgi?id=189265 */
      scroll-margin-left: var(--scroll-margin-left);
    }
  }

  .article {
    box-shadow: var(--box-shadow);
    display: grid;
    grid-template-rows: 1fr;
    margin-bottom: calc(var(--spacing-small) * 2);
    margin-top: calc(var(--spacing-small) * 2);

    &:focus:not(:focus-visible) {
      outline: none;
    }

    & :global(img) {
      opacity: 0;
      transition: opacity 100ms;
    }

    @media (--medium) {
      display: block;
      margin-bottom: calc(var(--spacing-small) * 2);
      margin-top: calc(var(--spacing-small) * 2);
    }
  }
</style>

<script>
  import article from "stores/article";
  import articles from "stores/articles";
  import debounce from "library/debounce";
  import feed from "stores/feed";
  import partial from "library/partial";
  import RichText from "components/rich-text";
  import { createEventDispatcher, tick } from "svelte";

  const dispatch = createEventDispatcher();
  const references = {};
  let active;
  let html;
  let isProgrammaticScroll;
  let isReady;

  // TODO: wait for images to load before restoring scroll if there's a scroll?
  // TODO: only if not offline. but what to do in that case?
  $: html = $articles[$article] && $articles[$article].html;

  $: focused = active && active.isConnected
    ? active
    : references.article
      ? references.article
      : null;

  $: {
    $article; // eslint-disable-line no-unused-expressions
    restoreScroll();
  }

  async function restoreScroll(container = references.container) {
    if (!container) {
      return;
    }

    await tick();
    await articles.ready;

    // Prevents scrollbar flash after setting `scrollTop`.
    container.style.overflow = "hidden";

    if (!$articles[$article]) {
      return;
    }

    isProgrammaticScroll = true;
    container.style.scrollBehavior = "auto";
    container.scrollTop = $articles[$article].y;
    container.style.scrollBehavior = "";
    isReady = true;

    setTimeout(() => {
      container.style.overflow = "";
    });
  }

  async function onScroll() {
    if (isProgrammaticScroll) {
      isProgrammaticScroll = false;
      return;
    }

    $articles[$article].y = references.container.scrollTop;
  }

  function showImages(article) {
    const show = () => {
      article
        .querySelectorAll("img")
        .forEach(img => {
          const show = () => {
            img.style.opacity = 1;
          };

          img.onload = show;
          img.onerror = show;
        });
    };

    show();

    return {
      async update() {
        await tick();
        show();
      },
    };
  }

  async function setLeft(article = references.article) {
    if (!article) {
      return;
    }

    // If we're restoring scroll, then article has just changed. Wait
    // for the new article to render.
    await tick();
    const { width } = article.getBoundingClientRect();
    references.container.style.left = `${window.innerWidth / 2 - width / 2}px`;
  }

  function onFocusin(event) {
    active = event.target;
    dispatch("focus");
  }

  function focus() {
    focused.focus({
      preventScroll: true,
    });
  }

  export {
    focus,
  };
</script>
