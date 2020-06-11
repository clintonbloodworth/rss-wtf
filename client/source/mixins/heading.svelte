<div class="heading">
  <slot></slot>
</div>

<style>
  .heading {
    display: contents;
  }

  :global(noscript h1),
  .heading > :global(*) {
    font-family: var(--font-sans-serif);
    font-size: 44px;
    text-align: center;
    text-shadow: var(--text-shadow);
    text-transform: uppercase;
    width: 100%;
  }
</style>
