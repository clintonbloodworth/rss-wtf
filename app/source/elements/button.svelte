<svelte:window on:mouseup={on_mouse_up}/>

<button
  {formmethod}
  {type}
  bind:this={references.button}
  class:button--destructive={variation === 'destructive'}
  class="button"
  disabled={isDisabled}
  on:click="{() => dispatch('click')}"
  on:mousedown="{on_mouse_down}">

  <slot />
</button>

<style>
  @import "library/functions";

  .button {
    background-color: var(--color-foreground);
    border: var(--border);
    border-style: dashed;
    border-radius: var(--border-radius);
    color: var(--color-text);
    font-family: var(--font-family-code);
    font-size: rem(14px);
    padding: rem(6px) rem(10px);
    transition: transform 100ms;
    user-select: none;
    white-space: nowrap;

    &--destructive {
      color: var(--color-destructive);

      &[disabled] {
        color: var(--color-text);
      }
    }

    &[disabled] {
      opacity: 0.5;
    }

    &:active {
      background: #0e0e0e;
    }
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const references = {};

  let formmethod = 'get';
  let isCaught = false;
  let isDisabled = false;
  let type = 'button';
  let variation = '';

  function focus() {
    references.button.focus();
  }

  function on_mouse_down() {
    isCaught = true;
    dispatch('catch');
  }

  function on_mouse_up(event) {
    if (!isCaught || event.target === references.button) {
      return;
    }

    dispatch('release');
  }

  export {
    focus,
    formmethod,
    isDisabled,
    type,
    variation,
  };
</script>
