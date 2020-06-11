<Centered {error} >
  <Heading>
    <h1>
      Sign In
    </h1>
  </Heading>

  <form class="sign-in" on:submit="{onSubmit}">
    <TextField
      autocomplete="username"
      label="Username"
      isError="{isSubmitAttempt && !$store.username}"
      name="username"
      spellcheck="false"
      bind:this="{references.username}"
      bind:value="{$store.username}" />

    <TextField
      autocomplete="current-password"
      bind:this="{references.password}"
      on:input={onPasswordInput}
      isError="{isSubmitAttempt && !isPasswordValid}"
      label="Password"
      maxlength="1000"
      name="password"
      spellcheck="false"
      type="password"
      value={password} />

    <Button isDisabled={$isOffline || isSubmitting} label="Sign In" type="submit" />
  </form>
</Centered>

<style>
  .sign-in {
    display: contents;
  }
</style>

<script context="module">
  import writable from "library/writable";
  import { on, emit } from "library/events";

  const store = writable({}, {
    adapter: "ls",
    name: "routes/signin",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import { getContext, tick } from "svelte";
  import Button from "components/button";
  import Centered from "layouts/centered";
  import Heading from "mixins/heading";
  import Link from "components/link";
  import TextField from "components/text-field";
  import isOffline from "stores/offline";
  import isLoading from "stores/loading";
  import user from "stores/user";
  import userbase from "library/userbase";

  const route = getContext("route");
  const references = {};

  let error;
  let isPasswordValid;
  let isSubmitAttempt;
  let isSubmitting;
  let password = "";

  // TODO: input should cancel submit. same for sign in.

  async function onSubmit(event) {
    event.preventDefault();
    isSubmitAttempt = true;
    error = null;

    if (!$store.username || !isPasswordValid) {
      return;
    }

    $isLoading = true;
    isSubmitting = true;

    try {
      await userbase.signIn($store.username, password);
    } catch (error$) {
      if (error$.name === "UserNotFound") {
        error = "No Such User";
      } else if (error$.name === "PasswordAttemptLimitExceeded") {
        error = "Login Attempts Exceeded";
      } else if (error$.name === "UsernameOrPasswordMismatch") {
        error = "Wrong Username Or Password";
      } else if (error$.name === "ServiceUnavailable") {
        error = "Couldn't Contact Server";
      } else if (error$.name === "UserAlreadySignedIn") {
        $user.username = $store.username;
        $user.isAuthenticated = true;
        route("/app");
      }

      $isLoading = false;
      isSubmitting = false;
      console.log(error$);
      return;
    }

    // `emit("reset")` will reset the store. We assign
    // `username` to a variable so we don't lose it.
    const { username } = $store;

    if (username !== $user.username) {
      emit("reset");
    }

    $user.username = username;
    $user.isAuthenticated = true;
    password = "";
    $isLoading = false;
    isSubmitting = false;
    isSubmitAttempt = false;
    route("/app", true);
  }

  function onPasswordInput(event) {
    password = event.detail;
    isPasswordValid = password && password.length >= 6;
  }
</script>
