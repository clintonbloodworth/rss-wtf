<div class="slider">
  <div class="slides" style="transform: {transform};">
    {#each slides$ as _, index}
      <div
        aria-hidden="{slide !== index}"
        class="slide"
        class:hidden="{slide !== index}">

        <slot {index} />
      </div>
    {/each}
  </div>
</div>

<style>
  .slider {
    --scroll-margin-top: max(calc(var(--spacing-small) + var(--spacing-large)), calc(var(--spacing-small) + env(safe-area-inset-bottom)));

    background-color: var(--color-background);
    border: var(--border);
    border-radius: var(--border-radius);
    overflow-x: hidden;
    scroll-margin-top: var(--scroll-margin-top);
    scroll-snap-align: start;
    scroll-snap-margin-top: var(--scroll-margin-top);
  }

  .slides {
    display: flex;
    transition: 200ms transform;

    & :global(> *) {
      flex-shrink: 0;
      width: 100%;
    }
  }

  .slide {
    align-content: center;
    align-content: space-around;
    display: grid;
    grid-auto-columns: minmax(0, 100%);
    grid-auto-rows: max-content;
    grid-gap: var(--spacing-small);
    padding: var(--spacing-small);

    &.hidden {
      visibility: hidden;
    }
  }

  .slide :global(h3) {
    font-family: var(--font-sans-serif);
    text-align: center;
    text-transform: lowercase;
  }
</style>

<script>
  let slide = 0;
  let slides;
  let slides$;
  let transform;

  $: slides$ = [...Array(slides)]; // JavaScript is a bummer.
  $: transform = `translateX(${slide * -100}%)`;

  function next(amount = 1) {
    slide += amount;
  }

  function previous(amount = 1) {
    slide -= amount;
  }

  export {
    next,
    previous,
    slides,
  };
</script>
