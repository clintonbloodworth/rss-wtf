<div class="control">
  <slot></slot>
</div>

<style>
  .control {
    display: contents;
  }

  .control > :global(*) {
    align-items: center;
    background-color: var(--color-background);
    color: var(--color-foreground);
    display: flex;
    font-family: var(--font-monospace);
    font-size: var(--font-size-large);
    font-weight: 500;
    height: 40px;
    justify-content: center;
    text-transform: lowercase;
    user-select: none;
  }
</style>
