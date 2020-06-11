<Button 
  {isDire} 
  {isRequiresConfirmation} 
  bind:isConfirming={isConfirming}>

  <button
    {type}
    bind:this="{references.button}"
    class="button"
    disabled="{isDisabled}"
    draggable="false"
    on:click>

    {label}
  </button>
</Button>

<script>
  import Button from "mixins/button";

  const references = {};
  let isConfirming = false;
  let isDire = false;
  let isDisabled = false;
  let isRequiresConfirmation = false;
  let label;
  let type = "button";

  function focus() {
    references.button.focus();
  }

  export {
    focus,
    isConfirming,
    isDire,
    isDisabled,
    isRequiresConfirmation,
    label,
    type,
  };
</script>
