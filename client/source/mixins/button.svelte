<div class="button">
  <Control>
    <slot></slot>
  </Control>
</div>

<style>
  .button {
    display: contents;
  }

  .button :global(*) {
    --transition-duration: 200ms;

    border: var(--border-width) var(--border-style) var(--border-color);
    background-color: var(--background-color, rgb(var(--color-background)));
    border-radius: var(--border-radius);
    font-family: var(--font-sans-serif);
    height: 40px;
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
    font-weight: 700;
    user-select: none;
    transition:
      border-color var(--transition-duration),
      box-shadow var(--transition-duration),
      color var(--transition-duration),
      transform var(--transition-duration);

    &:active {
      box-shadow: none;
      transform: scale(0.99);
    }

    &[disabled],
    &.disabled {
      box-shadow: none;
      color: rgba(var(--color-foreground), 0.6);
    }

    &:focus-visible {
      border-radius: var(--focus-outline-radius);
    }
  }
</style>

<script>
  import Control from "mixins/control";
</script>
