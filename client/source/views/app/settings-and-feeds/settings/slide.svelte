<div class="slide">
  <h2 class="heading">
    {heading}
  </h2>

  <slot></slot>
</div>

<style>
  .slide {
    align-content: center;
    display: grid;
    grid-auto-rows: max-content;
    grid-gap: var(--spacing-small);
    padding: var(--spacing-small);
  }

  .heading {
    --margin: 4px;

    background: rgb(var(--color-background));
    font-family: var(--font-sans-serif);
    font-size: 22px;
    font-weight: 700;
    margin-bottom: var(--margin);
    margin-top: var(--margin);
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    text-transform: lowercase;
  }

</style>

<script>
  let heading;

  export {
    heading,
  };
</script>
