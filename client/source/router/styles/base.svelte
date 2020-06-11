<style>
  /* stylelint-disable no-descending-specificity */

  :global(*) {
    box-sizing: border-box;

    &:focus {
      border-radius: var(--border-radius) !important;
      box-shadow: inset 0px 0px 0px 2px var(--color-focus) !important;
      outline: none;
    }
  }

  :global(::before, ::after) {
    box-sizing: border-box;
  }

  :global(html) {
    height: 100%;
  }

  :global(body) {
    background-color: var(--color-background);
    color: var(--color-foreground);
    -webkit-font-smoothing: antialiased;
    height: 100%;
    width: 100%;
  }

  :global(noscript) {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    width: 100%;
  }

  :global(noscript main) {
    width: 250px;
  }
</style>
