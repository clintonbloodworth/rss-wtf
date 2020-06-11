<Slides>
  <Slide heading="Payment">
    <TextField 
      autocomplete="cc-number" 
      label="Number" />

    <div class="details">
      <TextField autocomplete="cc-exp" label="Expiry" />
      <TextField autocomplete="cc-csc" label="CCV" />
    </div>

    <Button label="Edit" />
  </Slide>
</Slides>

<style>
  .details {
    display: grid;
    grid-gap: var(--spacing-small);
    grid-template-columns: 1fr 1fr;
  }
</style>

<script>
  import Button from "components/button";
  import Slide from "./slide";
  import Slides from "./slides";
  import TextField from "components/text-field";
</script>
