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

    background-color: var(--background-color, var(--color-background));
    border: var(--border-width) var(--border-style) var(--border-color);
    border-radius: var(--border-radius);
    font-family: var(--font-sans-serif);
    font-weight: 700;
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
    transition:
      border-color var(--transition-duration),
      color var(--transition-duration);
    user-select: none;

    &[disabled],
    &.disabled {
      opacity: 0.6;
    }

    &:focus {
      border-radius: var(--focus-outline-radius);
    }
  }
</style>

<script>
  import Control from "mixins/control";
</script>
