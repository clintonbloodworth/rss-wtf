<svelte:window on:mouseup={onMouseUp} />

<div 
  bind:this={references.button}
  class="button"
  class:dire={isDire}
  class:confirming={isRequiresConfirmation && isConfirming}
  on:click={onClick}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}>

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

    border: var(--border-width) solid var(--color-border);
    border-radius: var(--border-radius-small);
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
    transition:
      border-color var(--transition-duration),
      box-shadow var(--transition-duration),
      color var(--transition-duration),
      transform var(--transition-duration);

    &:active {
      box-shadow: none;
      transform: scale(0.99);
    }

    &:focus-visible {
      border-radius: var(--focus-outline-radius);
    }

    &[disabled],
    &.disabled {
      box-shadow: none;
      color: rgba(var(--color-foreground), 0.6);
    }
  }

  .button.dire :global(*),
  .button.confirming > :global(*) {
    --color: var(--color-red);

    &:focus {
      outline-color: var(--color);
    }
  }

  .button.confirming :global(*) {
    animation: jiggle 250ms infinite;
    transform: rotate(-0.5deg);

    &:active {
      animation-play-state: paused;
    }

    @keyframes jiggle {
      0% {
        transform: rotate(-0.5deg);
      }

      50% {
        transform: rotate(0.5deg);
      }
    }
  }
</style>

<script>
  import Control from "mixins/control"

  const references = {};
  let isConfirming = false;
  let isDire = false;
  let isRequiresConfirmation = false;
  let timeoutId;

  function onClick() {
    if (!isRequiresConfirmation) {
      return;
    }

    if (isConfirming) {
      setTimeout(() => {
        isConfirming = false;
      });

      return;
    }

    isConfirming = true;

    timeoutId = setTimeout(() => {
      isConfirming = false;
    }, 3000);
  }

  function onMouseDown() {
    clearTimeout(timeoutId);
  }

  function onMouseUp(event) {
    if (!references.button.contains(event.target)) {
      isConfirming = false;
    }
  }

  export {
    isConfirming,
    isDire,
    isRequiresConfirmation,
  };
</script>
