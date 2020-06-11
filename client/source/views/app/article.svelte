<svelte:window on:resize="{debounce(partial(setLeft, undefined), 50)}" />

  <!-- 
    This component's width is set to 100vw by its parent, which
    allows for distraction-free reading. However, we also want
    `.container` to stick to the center of the viewport when it's
    the only thing in it. And a 100vw `.container` would prevent 
    this. Thus this classless DIV.
  -->
<div>
  {#if html}
    <div
      bind:this="{references.container}"
      on:scroll="{onScroll}"
      use:restoreScroll
      class="container"
      class:ready={isReady}>

      <div 
        bind:this="{references.article}" 
        class="article"
        use:setLeft
        tabindex="0">

        <RichText>
          {@html html}
        </RichText>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    grid-area: article;
    height: 100%;
    overflow: hidden auto;
    padding-top: var(--spacing-large);
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

      padding-left: 0px;
      padding-right: 0px;
      padding-top: var(--spacing-small);
      scroll-margin-left: var(--scroll-margin-left);
      scroll-snap-margin-left: var(--scroll-margin-left);
    }
  }

  .article {
    display: grid;
    grid-template-rows: 1fr;
    margin-bottom: calc(var(--spacing-small) * 2);

    @media (--medium) {
      justify-content: center;
      margin-bottom: calc(var(--spacing-small) * 2);
      margin-top: calc(var(--spacing-small) * 2);
    }

    @media (--small) {
      margin-bottom: var(--spacing-small);
      margin-top: var(--spacing-small);
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

  $: html = $articles[$article] && $articles[$article].html;

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
    container.style.overflow = "hidden"; // Prevents scrollbar flash after setting `scrollTop`.

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

  async function setLeft(article = references.article) {
    if (!article) {
      return;
    }

    // If we're restoring scroll, then article has just changed.
    // Wait for the new article to render.
    await tick();
    const { width } = article.getBoundingClientRect();
    references.container.style.left = `${window.innerWidth / 2 - width / 2}px`;
  }
</script>
