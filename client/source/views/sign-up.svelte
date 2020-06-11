<Centered {error} store="routes/signup">
  <form class="form" on:submit="{onSubmit}">
    <Heading>
      <h1 class="heading">
        Sign Up
      </h1>
    </Heading>

    <p class="description">
      WTF is an RSS reader
    </p>

    <TextField
      autocomplete="username"
      isError={isUsernameInvalid}
      label="Username"
      name="username"
      on:input={onUsernameInput}
      value={$store.username} />

    <p class="description">
      It costs $1.5 per month after 30 days free
    </p>

    <TextField
      autocomplete="current-password"
      isError={isPasswordInvalid}
      label="Password"
      maxlength="1000"
      name="password"
      on:input={onPasswordInput}
      type="password"
      value="{password}" />

    <p class="description">
      Don't lose your password
    </p>

    <TextField
      autocomplete="current-password"
      isError={isConfirmedPasswordInvalid}
      label="Password"
      maxlength="1000"
      name="confirmedPassword"
      on:input={onConfirmedPasswordInput}
      type="password"
      value="{confirmedPassword}" />

    <p class="description">
       We can't reset without your email
    </p>

    <Link label="Policies" on:click={onPoliciesClick} url="/policies" />

    <p class="description">
      Which we don't want
    </p>

    <Button 
      isDisabled={$isOffline || isSubmitting} 
      label="Sign Up" 
      type="submit" />
  </form>
</Centered>

<style>
  .form {
    display: contents;
  }

  .description {
    --margin: var(--spacing-tiny);

    color: rgb(var(--color-foreground));
    font-family: var(--font-sans-serif);
    font-size: var(--font-size-small);
    font-weight: 700;
    hyphens: auto;
    line-height: 1.2;
    overflow: hidden;
    position: relative;
    text-align: center;
    text-transform: uppercase;
    text-shadow: var(--text-shadow);
    margin: var(--margin) auto;
    padding-left: var(--spacing-medium);
    padding-right: var(--spacing-medium);
  }
</style>

<script context="module">
  import writable from "library/writable";
  import { on, emit } from "library/events";

  // These are here instead of the instance script so they're
  // kept in memory and can be restored if the user navigates
  // to Policies and back.
  let confirmedPassword;
  let isSubmitAttempt;
  let password;

  const store = writable({}, {
    adapter: "ls",
    name: "routes/signup",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import Button from "components/button";
  import Centered from "layouts/centered";
  import Heading from "mixins/heading";
  import isLoading from "stores/loading";
  import isOffline from "stores/offline";
  import Link from "components/link";
  import TextField from "components/text-field";
  import user from "stores/user";
  import userbase from "library/userbase";
  import { getContext, onMount, tick } from "svelte";

  const route = getContext("route");
  let error;
  let isConfirmedPasswordInvalid;
  let isPasswordInvalid;
  let isSubmitting;
  let isUsernameInvalid;

  onMount(() => {
    isUsernameInvalid = isSubmitAttempt
      && $store.username !== undefined
      && !validateUsername($store.username);

    isPasswordInvalid = isSubmitAttempt
      && password !== undefined
      && !validatePassword(password);

    isConfirmedPasswordInvalid = isSubmitAttempt
      && confirmedPassword !== undefined
      && !validateConfirmedPassword(confirmedPassword);
  });

  async function onSubmit(event) {
    event.preventDefault();
    isSubmitAttempt = true;
    isPasswordInvalid = !validatePassword();
    isConfirmedPasswordInvalid = !validateConfirmedPassword();
    isUsernameInvalid = !validateUsername();

    if (isUsernameInvalid || isPasswordInvalid || isConfirmedPasswordInvalid) {
      return;
    }

    isSubmitting = true;
    $isLoading = true;

    try {
      await userbase.signUp($store.username, password);
    } catch (error$) {
      $isLoading = false;
      isSubmitting = false;

      if (error$.name === "UserAlreadySignedIn") {
        $user.username = $store.username;
        $user.isAuthenticated = true;
        route("/app");
        return;
      }

      error = error$.message;
      console.log(error$);
      return;
    }

    emit("reset");
    password = "";
    confirmedPassword = "";
    $user.isAuthenticated = true;
    $user.username = $store.username;
    $isLoading = false;
    isSubmitting = false;
    isSubmitAttempt = false;
    route("app", true);
  }

  function onUsernameInput(event) {
    $store.username = event.detail;
    isUsernameInvalid = isSubmitAttempt && !validateUsername();
  }

  function onPasswordInput(event) {
    password = event.detail;
    isPasswordInvalid = isSubmitAttempt && !validatePassword();
  }

  function onConfirmedPasswordInput(event) {
    confirmedPassword = event.detail;
    isConfirmedPasswordInvalid = isSubmitAttempt && !validateConfirmedPassword();
  }

  function validateUsername() {
    return $store.username;
  }

  function validatePassword() {
    return password && password.length >= 6;
  }

  function validateConfirmedPassword() {
    return confirmedPassword && confirmedPassword.length >= 6 && confirmedPassword === password;
  }

  function onPoliciesClick(event) {
    event.preventDefault();
    route(event.target.href);
  }
</script>
