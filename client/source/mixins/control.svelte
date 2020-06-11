<div class="control">
  <slot></slot>
</div>

<style>
  .control {
    display: contents;
  }

  .control > :global(*) {
    align-items: center;
    background-color: rgb(var(--color-background));
    box-shadow: var(--box-shadow);
    color: var(--color-foreground);
    display: flex;
    font-family: var(--font-monospace);
    font-size: var(--font-size-medium);
    font-weight: 500;
    height: 35px;
    justify-content: center;
    text-transform: lowercase;
    user-select: none;
  }
</style>
