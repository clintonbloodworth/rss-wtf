<Control>
  <div class="container" class:error="{isError}">
    <label class:hidden="{value}" for="{id}">
      {label}
    </label>

    <input
      autocapitalize="{autocapitalize}"
      autocorrect="{autocorrect}"
      autocomplete="{autocomplete}"
      enterkeyhint="{enterkeyhint}"
      id="{id}"
      maxlength="{maxlength}"
      name="{name}"
      readonly="{readonly}"
      spellcheck="{spellcheck}"
      type="{type}"
      value="{value}"
      bind:this="{references.input}"
      class:error={isError}
      on:blur="{onBlur}"
      on:click="{onClick}"
      on:focus="{onFocus}"
      on:input="{onInput}"
      on:keydown="{onKeydown}"
      on:select="{onSelect}" />
  </div>
</Control>

<style>
  .container {
    --border-radius: var(--border-radius-small);

    background-color: rgb(var(--color-background));
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    position: relative;

    &::before {
      border: var(--border-width) dashed var(--color-border);
      border-radius: var(--border-radius);
      content: "";
      height: 100%;
      left: 0;
      pointer-events: none;
      position: absolute;
      width: 100%;
    }

    &:focus-within {
      &::before {
        border-color: transparent !important;
      }
    }

    &.error {
      &::before {
        border-color: var(--color-red);
        border-width: calc(var(--border-width) * 2);
      }
    }
  }

  input {
    border: calc(var(--border-width) * 2) var(--border-style) transparent;
    border-radius: var(--border-radius);
    color: rgb(var(--color-foreground));
    font-family: var(--font-family);
    font-size: inherit;
    font-style: italic;
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
    text-align: center;
    height: 100%;
    width: 100%;

    &.error {
      box-shadow: none;
    }

    &:focus {
      box-shadow: none;

      &.error {
        outline-color: var(--color-red);
      }
    }
  }

  label {
    align-items: center;
    border-radius: var(--border-radius-small);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    line-height: 100%;
    margin-bottom: 0;
    position: absolute;
    top: 0;
    user-select: none;
    width: 100%;

    &.hidden {
      visibility: hidden;
    }
  }
</style>

<script>
  import Control from "mixins/control"
  import { createEventDispatcher } from "svelte";

  // TODO: use components/border so dashed is the same.

  const dispatch = createEventDispatcher();
  const references = {};

  let autocapitalize = "off";
  let autocomplete = "";
  let autocorrect = "off";
  let enterkeyhint = "";
  let id = Math.random().toString().slice(2);
  let isError = false;
  let isFocus = false;
  let label;
  let maxlength;
  let name = "";
  let readonly = false;
  let selection = {};
  let spellcheck = "false";
  let type = "";
  let value = "";

  $: {
    maxlength = type === "password" ? 1000 : null;
  }

  function onClick() {
    dispatch("click");
  }

  function onSelect() {
    selection.start = references.input.selectionStart;
    selection.end = references.input.selectionEnd;
  }

  function onFocus(event) {
    isFocus = true;
    dispatch("focus", event);
  }

  function onBlur(event) {
    isFocus = false;
    dispatch("blur", event);
  }

  function onInput(event) {
    value = event.target.value;
    dispatch("input", value);
  }

  function onKeydown(event) {
    selection.end = references.input.selectionEnd;
    selection.start = references.input.selectionStart;
    dispatch("keydown", event);
  }

  function focus() {
    references.input.focus();
  }

  function setSelectionRange(...arguments$) {
    references.input.setSelectionRange(...arguments$);
  }

  export {
    autocomplete,
    autocapitalize,
    autocorrect,
    readonly,
    enterkeyhint,
    focus,
    id,
    isError,
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
