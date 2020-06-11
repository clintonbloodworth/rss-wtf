<div class="text-field">
  <div class="container">
    <input
      {autocapitalize}
      {autocorrect}
      {readonly}
      {enterkeyhint}
      {id}
      {maxlength}
      {name}
      {spellcheck}
      {type}
      {value}
      bind:this={references.input}
      class="input"
      on:click={on_click}
      on:input={on_input}
      on:focus={on_focus}
      on:blur={on_blur}
      on:keydown={on_key_down}
      on:select={on_select}>

    <label class="label" class:label--hidden={Boolean(value)} for="{id}">
      {label}
    </label>

    <slot></slot>
  </div>
</div>

<style>
  @import "library/functions";
  @import "library/mixins.scss";

  .text-field {
    align-items: center;
    background-color: var(--background-color, var(--color-foreground));
    border: var(--border-width) dashed var(--color-border);
    border-radius: var(--border-radius);
    display: flex;
    width: 100%;
  }

  .container {
    --margin: #{rem(8px)} #{rem(10px)};

    display: flex;
    font-family: var(--font-family-code);
    font-size: rem(14px);
    margin: var(--margin);
    position: relative;
    width: 100%;
  }

  .input {
    color: var(--color-text);
    flex-grow: 1;
    font-family: inherit;
    font-size: inherit;
    font-weight: 500;
    padding-right: var(--padding-right, 0);
    width: 9rem;
  }

  .label {
    color: var(--color-text);
    font-weight: 400;
    font-style: italic;
    left: 0;
    opacity: 0.5;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &--hidden {
      @include visually-hidden();
    }
  }
</style>

<script>
  // Imports
  import { createEventDispatcher } from 'svelte';

  // Constants
  const dispatch = createEventDispatcher();
  const references = {};

  // State
  let autocapitalize = 'off';
  let autocorrect = 'off';
  let enterkeyhint = '';
  let id = Math.random().toString().slice(2);
  let isFocus = false;
  let label;
  let maxlength = null;
  let name = '';
  let readonly = false;
  let selection = {};
  let spellcheck = 'false';
  let type = '';
  let value = '';

  // Functions
  function on_click() {
    dispatch('click');
  }

  function on_select() {
    selection.start = references.input.selectionStart;
    selection.end = references.input.selectionEnd;
  }

  function on_focus(event) {
    isFocus = true;
    dispatch('focus', event);
  }

  function on_blur(event) {
    isFocus = false;
    dispatch('blur', event);
  }

  function on_input(event) {
    value = event.target.value;
    dispatch('input');
  }

  function on_key_down(event) {
    selection.end = references.input.selectionEnd;
    selection.start = references.input.selectionStart;
    dispatch('keydown', event);
  }

  function focus() {
    references.input.focus();
  }

  function setSelectionRange(...arguments$) {
    references.input.setSelectionRange(...arguments$);
  }

  // Exports
  export {
    autocapitalize,
    autocorrect,
    readonly,
    enterkeyhint,
    focus,
    id,
    isFocus,
    label,
    maxlength,
    name,
    selection,
    setSelectionRange,
    spellcheck,
    type,
    value,
  };
</script>
