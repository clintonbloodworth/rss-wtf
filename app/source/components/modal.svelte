<svelte:window on:keydown={onWindowKeydown} />

<div
  bind:this={references.modal}
  class="modal"
  class:modal--visible={visible}
  on:click={hide}>

  <form action="" on:submit={onSubmit}>
    <label
      class="label"
      class:label--error={isError}
      class:label--loading={isLoading}>

      <span class="label-text">
        {label}:
      </span>

      <input
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        bind:this={references.input}
        on:input={onInput}
        class="input"
        value={query}
        spellcheck="false">
    </label>
  </form>

  {#if controls.length}
    <ul class="controls">
      {#each controls as control}
        <li>
          <button class="button" on:click={partial(onControlClick, control)}>{control.title}</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  @import "library/functions";

  .modal {
    backdrop-filter: grayscale(100%);
    background-color: #0000007a;
    display: grid;
    grid-template-rows: max-content 1fr;
    height: 100vh;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    transition: opacity 300ms;
    width: 100vw;
    z-index: 2147483647;

    &--visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .label {
    align-items: center;
    background: black;
    border-bottom: 5px dashed white;
    display: grid;
    grid-template-columns: max-content 80% max-content;
    justify-content: space-between;
    padding: 0.3rem;

    &--error {
      border-color: red;
    }

    &--loading {
      border-color: blue;
    }
  }

  .label-text {
    color: white;
    font-family: var(--font-family-code);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .input {
    color: white;
    font-family: var(--font-family-heading);
    font-size: 1.2rem;
    font-weight: 700;
    text-align: center;
  }

  .controls {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    justify-self: center;
    list-style-type: none;
    overflow: auto;
  }

  .button {
    color: white;
    font-family: var(--font-family-heading);
    font-size: rem(112px);
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import partial from 'lodash-es/partial';

  const dispatch = createEventDispatcher();
  const references = {};

  let controls = [];
  let isLoading = false;
  let isError = false;
  let label;
  let query = '';
  let visible;

  function hide(event) {
    if (event && event.target !== references.modal) {
      return;
    }

    visible = false;
  }

  function show() {
    references.input.focus();
    references.input.select();
    visible = true;
  }

  function onWindowKeydown(event) {
    if (event.key !== 'Escape') {
      return;
    }

    visible = false;
  }

  function onSubmit(event) {
    event.preventDefault();
    dispatch('submit', query);
  }

  function onControlClick(control) {
    dispatch('action', control);
  }

  function onInput(event) {
    query = event.target.value;
    dispatch('input', query);
  }

  export {
    controls,
    isLoading,
    isError,
    label,
    query,
    show,
    hide,
  };
</script>
