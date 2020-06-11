<header>
  <slot></slot>

  {#if aside}
    <div class="container">
      <aside>
        {aside}
      </aside>
    </div>
  {/if}
</header>

<style>
  header > :global(*),
  :global(noscript h1) {
    font-family: var(--font-sans-serif);
    font-size: 44px;
    hyphens: auto;
    overflow: hidden;
    overflow-wrap: break-word;
    text-align: center;
    text-shadow: var(--text-shadow);
    text-transform: uppercase;
    width: 100%;
  }

  .container {
    align-items: center;
    display: grid;
    font-family: var(--font-monospace);
    font-size: var(--font-size-large);
    grid-template-columns: min-content minmax(0, min-content) min-content;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--spacing-tiny);
    max-width: 80%;
    overflow: hidden;
    text-transform: lowercase;
    white-space: nowrap;

    &::before,
    &::after {
      color: var(--color-accent);
      display: inline-block;
    }

    &::before {
      content: "(";
    }

    &::after {
      content: ")";
    }
  }

  aside {
    display: inline-block;
    font-style: italic;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    text-shadow: var(--text-shadow);
  }
</style>

<script>
  let aside = "";

  export {
    aside,
  };
</script>
