<div class="settings">
  {#if error}
    <p>{error.message}</p>
  {/if}

  <form on:submit={sign_out}>
    <Button type="submit">
      Sign Out
    </Button>
  </form>

  <form on:submit={delete_account}>
    <Button type="submit">
      Delete Account
    </Button>
  </form>
</div>

<style>
  .settings {
    grid-area: settings;
  }
</style>

<script>
  import { getContext } from 'svelte';
  import Button from 'elements/button';
  import TextField from 'elements/text-field';
  import userbase from 'userbase-js';

  const state = getContext('state');
  let password = '';
  let username = '';
  let error;
  let isLoading = true;

  async function sign_up(event) {
    event.preventDefault();

    try {
      await userbase.signUp({
        username,
        password,
        rememberMe: 'session'
      });

      error = null;
    } catch (error$) {
      error = error$;
      console.log(error, 'error');
      return;
    }

    error = null;
    $state.isAuthenticated = true;
  }

  async function sign_in(event) {
    event.preventDefault();

    try {
      await userbase.signIn({
        username,
        password,
        rememberMe: 'session'
      });
    } catch (error$) {
      error = error$;
      console.log(error$, 'error');
      return;
    }

    error = null;
    $state.isAuthenticated = true;
  }

  async function sign_out(event) {
    event.preventDefault();

    try {
      await userbase.signOut();
    } catch (error$) {
      error = error$;
      console.log(error$, 'error');
      return;
    }

    error = null;
    username = '';
    $state.isAuthenticated = false;
  }

  async function delete_account(event) {
    event.preventDefault();

    try {
      await userbase.deleteUser();
    } catch (error$) {
      error = error$;
      console.log(error$, 'error');
      return;
    }

    error = null;
    username = '';
    $state.isAuthenticated = false;
  }
</script>
