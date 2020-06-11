<svelte:window on:mouseup={onMouseUp} />

<Button>
  <button
    {type}
    bind:this="{references.button}"
    class:confirming={isRequiresConfirmation && isConfirming}
    class:dangerous={isDangerous}
    class="button"
    disabled="{isDisabled}"
    draggable="false"
    on:click
    on:click={onClick}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}>

    {label}
  </button>
</Button>

<style>
  button {
    animation-duration: 200ms;
    animation-iteration-count: infinite;

    &.confirming {
      animation-name: rotate;

      @keyframes rotate {
        0% {
          transform: rotate(-1deg);
        }

        50% {
          transform: rotate(1deg);
        }
      }
    }

    &.dangerous {
      --border-color: var(--color-red);
    }
  }
</style>

<script>
  import Button from "mixins/button";

  const references = {};
  let timeoutId;
  let isConfirming = false;
  let isDangerous = false;
  let isDisabled = false;
  let isRequiresConfirmation = false;
  let label;
  let type = "button";

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

  function focus() {
    references.button.focus();
  }

  export {
    focus,
    isConfirming,
    isDisabled,
    isDangerous,
    isRequiresConfirmation,
    label,
    type,
  };
</script>
