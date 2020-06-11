<Button>
  <a draggable="false" href="{url}" on:click>
    {label} 
  </a>
</Button>

<style>
  a {
    text-decoration: none;
    user-select: none;
  }
</style>

<script>
  import Button from "mixins/button";

  let label;
  let url;

  export {
    label,
    url,
  };
</script>
