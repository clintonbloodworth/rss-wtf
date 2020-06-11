<Border {isAnimate}>
  <div class="slides">
    <div class="slider" style="transform: {transform}">
      <slot />
    </div>
  </div>
</Border>

<style>
  .slides {
    background-color: rgb(var(--color-background));
    border-radius: var(--border-radius-small);
    box-shadow: var(--box-shadow);
    overflow-x: hidden;
    scroll-margin-top: calc(var(--spacing-small) * 2);
    scroll-snap-align: start;
  }

  .slider {
    display: flex;
    transition: 200ms transform;

    & :global(> *) {
      flex-shrink: 0;
      width: 100%;
    }
  }
</style>

<script>
  import Border from "components/border";

  let isAnimate = false;
  let slide = 0;
  let transform;

  $: transform = `translateX(${slide * -100}%)`;

  function next(number = 1) {
    slide += number;
  }

  function previous(number = 1) {
    slide -= number;
  }

  export {
    isAnimate,
    next,
    previous,
  };
</script>
