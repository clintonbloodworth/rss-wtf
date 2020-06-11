<Centered>
  <div class="anonymous">
    <Heading>
      <h1>WTF</h1>
    </Heading>

    {#if $user.isAuthenticated}
      <Link label="App" on:click={onClick} url="/app" />
    {:else}
      <Link label="Sign Up" on:click={onClick} url="/sign-up" />
    {/if}

    <Link label="Help" url="mailto:help@rss.wtf" />

    {#if $user.isAuthenticated}
      <Button>
        <button on:click={signOut} type="button">
          Sign Out
        </button>
      </Button>
    {:else}
      <Link label="Sign In" on:click={onClick} url="/sign-in" />
    {/if}
  </div>
</Centered>

<style>
  .anonymous {
    display: contents;
  }
</style>

<script>
  import { getContext } from "svelte";
  import Centered from "layouts/centered";
  import Link from "components/link";
  import Button from "mixins/button";
  import user from "stores/user";
  import Heading from "mixins/heading";

  const route = getContext("route");

  function onClick(event) {
    event.preventDefault();
    route(event.target.href);
  }

  function signOut() {
    event.preventDefault();
    $user.isAuthenticated = false;
  }
</script>
