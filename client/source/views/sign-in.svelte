<Centered {error} >
  <Header>
    <h1>
      Sign In
    </h1>
  </Header>

  <form on:submit="{onSubmit}">
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
  form {
    display: contents;
  }
</style>

<script context="module">
  import { writable } from "library/store";
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
  import Header from "components/header";
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

  async function onSubmit(event) {
    event.preventDefault();
    isSubmitAttempt = true;
    error = null;

    if (!$store.username || !isPasswordValid) {
      return;
    }

    $isLoading = true;
    isSubmitting = true;

    tryCatch: try {
      await userbase.signIn($store.username, password);
    } catch (error$) {
      switch (error$.name) {
        case "UserAlreadySignedIn":
          break tryCatch;
        case "UserNotFound":
          error = "No Such User";
          break;
        case "PasswordAttemptLimitExceeded":
          error = "Login Attempts Exceeded";
          break;
        case "UsernameOrPasswordMismatch":
          error = "Wrong Username Or Password";
          break;
        default:
          error = "Something Went Wrong";
          break;
      }

      $isLoading = false;
      isSubmitting = false;
      console.log(error$);
      return;
    }

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
