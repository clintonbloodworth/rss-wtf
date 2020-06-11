<style>
  /* stylelint-disable no-descending-specificity */

  :global(*) {
    box-sizing: border-box;

    &:focus:not(:focus-visible) {
      outline: none;
    }

    &:focus {
      outline-offset: 0px;
    }
  }

  :global(::before, ::after) {
    box-sizing: border-box;
  }

  :global(html) {
    height: 100%;
  }

  :global(body) {
    background-color: rgb(var(--color-background));
    color: rgb(var(--color-foreground));
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

<script>
  import { browser } from "library/browser";

  document.documentElement.dataset.browser = browser;
</script>
