<svelte:window on:pointerup={stop_timer} />

<div class="anonymous">
  <div></div>
  <div>
    <div class="icon" on:pointerdown={start_timer}>
      <Logo />
    </div>

    <p class="description">
      {#if error}
        <span class="error">
          {error}
        </span>
      {:else}
        dead simple rss
      {/if}
    </p>

    <ul class="links">
      <li class="link">
        <a href="mailto:support@rss.wtf">support</a>
      </li>
      <li class="link">
        <a href="#policies">policies</a>
      </li>
    </ul>

    <form class="form" on:submit={sign_in_or_up} method="post">
      <TextField
        label="username"
        on:input={clear_error}
        bind:value={$state.username}
        maxlength="100"
        name="user" />

      <TextField
        label="password"
        on:input={clear_error}
        bind:value={password}
        maxlength="1000"
        name="password"
        type="password" />

      <Button type="submit">
        sign in
      </Button>
    </form>
  </div>
</div>

<style>
  @import "library/functions";

  .anonymous {
    --gap: #{rem(6px)};

    height: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr max-content 1.2fr;
    padding: var(--gap);
  }

  .icon {
    width: 2.6rem;
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-bottom: rem(6px);
  }

  .description {
    font-family: var(--font-family-code);
    text-align: center;
    font-style: italic;
    font-size: rem(16px);
  }

  .error {
    color: var(--color-error);
  }

  .links {
    align-items: flex-end;
    bottom: var(--gap);
    display: grid;
    font-family: var(--font-family-code);
    font-size: 14px;
    grid-auto-flow: column;
    grid-gap: var(--gap);
    justify-content: center;
    list-style-type: none;
    margin-top: rem(6px);
    font-size: rem(12px);
  }

  .link {
    &:not(:first-child) {
      align-items: center;
      display: flex;

      &::before {
        content: "★";
        line-height: 0;
        display: block;
        font-size: rem(14px);
        margin-right: var(--gap);
      }
    }
  }

  .form {
    display: grid;
    grid-gap: var(--gap);
    margin-top: rem(12px);
  }
</style>

<script>
  import { getContext } from 'svelte';
  import Button from 'elements/button';
  import TextField from 'elements/text-field';
  import Logo from 'icons/logo';
  import userbase from 'userbase-js';

  // TODO: if "account already exists", switch to Sign In and sign in.
  const state = getContext('state');
  let password = '';
  let pointer_id;
  let account_show_id;
  let timeout_id;
  let error;

  async function sign_in_or_up(event) {
    event.preventDefault();

    await Promise.allSettled([
      userbase.signUp({
        password,
        username: $state.username,
        rememberMe: 'local'
      }),
      userbase.signIn({
        password,
        username: $state.username,
        rememberMe: 'local'
      }),
    ]).then(([sign_up_result, sign_in_result]) => {
      console.log(sign_up_result, 'sign_up_result');
      console.log(sign_in_result, 'sign_in_result');

      if (sign_up_result.status === 'rejected' && sign_in_result.status === 'rejected')     {
        if (sign_in_result.reason.name === 'UsernameOrPasswordMismatch') {
          error = 'bad credentials';
        } else {
          error = 'fuck';
        }
      } else {
        error = '';
        $state.isAuthenticated = true;
      }
    });
  }

  function start_timer(event) {
    pointer_id = event.pointerId;

    timeout_id = window.setTimeout(() => {
      account_show_id = true;
    }, 2000);
  }

  function stop_timer(event) {
    if (event.pointerId !== pointer_id) {
      return;
    }

    window.clearTimeout(timeout_id);
    pointer_id = null;
  }

  function clear_error() {
    error = null;
  }
</script>
