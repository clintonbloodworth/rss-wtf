<Centered>
  <Header>
    <h1>WTF</h1>

    <ul>
      <li>
        {#if $user.isAuthenticated}
          <a href="/app" on:click={onClick}>
            App
          </a>
        {:else}
          <a href="/sign-up" on:click={onClick}>
            Sign Up
          </a>
        {/if}
      </li>

      <li>
        {#if $user.isAuthenticated}
          <a href="/" on:click={signOut}>
            Sign Out
          </a>
        {:else}
          <a href="/sign-in" on:click={onClick}>
            Sign In
          </a>
        {/if}
      </li>
    </ul>
  </Header>
</Centered>

<style>
  h1 {
    line-height: 1.1;
    position: relative;
    left: -0.1em;
  }

  ul {
    --grid-gap:var(--spacing-small) ;
    align-items: center;
    display: grid;
    grid-gap: var(--grid-gap);
    margin-top: var(--spacing-small);
    grid-template-columns: repeat(4, max-content);
    justify-content: center;
  }

  li {
    font-size: var(--font-size-large);
    list-style-type: none;

    &:not(:last-child) {
      &::after {
        content: "★";
        font-size:  var(--font-size-miniscule);
        margin-left: var(--grid-gap);
        text-shadow: var(--text-shadow);
      }
    }
  }

  a {
    font-family: var(--font-sans-serif);
    font-weight: 700;
    color: rgb(var(--color-foreground));
    text-align: center;
    text-transform: lowercase;
    text-shadow: var(--text-shadow);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>

<script>
  import { getContext } from "svelte";
  import Centered from "layouts/centered";
  import Link from "components/link";
  import Button from "mixins/button";
  import partial from "library/partial";
  import user from "stores/user";
  import Header from "components/header";

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
