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
    left: -0.1em;
    line-height: 1.1;
    position: relative;
  }

  ul {
    --grid-gap: var(--spacing-small);

    align-items: center;
    display: grid;
    grid-gap: var(--grid-gap);
    grid-template-columns: repeat(4, max-content);
    justify-content: center;
    margin-top: var(--spacing-small);
  }

  li {
    font-size: var(--font-size-large);
    list-style-type: none;

    &:not(:last-child) {
      &::after {
        content: "★";
        font-size: var(--font-size-small);
        margin-left: var(--grid-gap);
        text-shadow: var(--text-shadow);
      }
    }
  }

  a {
    color: var(--color-foreground);
    display: inline-flex;
    font-family: var(--font-sans-serif);
    font-size: 24px;
    font-weight: 700;
    padding: 2px;
    text-align: center;
    text-decoration: none;
    text-shadow: var(--text-shadow);
    text-transform: lowercase;

    &:hover {
      text-decoration: underline;
    }
  }
</style>

<script>
  import Button from "mixins/button";
  import Centered from "layouts/centered";
  import Header from "components/header";
  import Link from "components/link";
  import partial from "library/partial";
  import user from "stores/user";
  import { getContext } from "svelte";

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
