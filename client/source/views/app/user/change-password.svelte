<Slides 
  {slides}
  bind:this={references.slides} 
  let:index>

  {#if index === 0}
    <form on:submit="{onSubmit}">
      <TextField
        autocomplete="current-password"
        bind:value="{currentPassword}"
        isError={isCurrentPasswordInvalid}
        label="current"
        type="password" />

      <div class="new-passwords">
        <TextField 
          autocomplete="new-password"
          isError={isNewPasswordInvalid}
          bind:value="{newPassword}"
          label="new"
          type="password" />

        <TextField
          autocomplete="new-password"
          bind:value="{newConfirmedPassword}" 
          label="new" 
          isError={isNewConfirmedPasswordInvalid}
          type="password" />
      </div>

      <Button 
        isDisabled={$isOffline} 
        label="Change Password" 
        type="submit" />
    </form>
  {:else}
    <Button label="OK" on:click={partial(references.slides.previous, undefined)} />
  {/if}
</Slides>

<style>
  form {
    display: contents;
  }

  .new-passwords {
    display: grid;
    grid-gap: var(--spacing-small);
    grid-template-columns: 1fr 1fr;
  }
</style>

<script>
  import Button from "components/button";
  import Header from "components/header";
  import isOffline from "stores/offline";
  import partial from "library/partial";
  import Slides from "../slides";
  import TextField from "components/text-field";
  import { tick } from "svelte";
  import user from "stores/user";
  import userbase from "library/userbase";

  const references = {};
  const slides = 2;
  let currentPassword = "";
  let isCurrentPasswordInvalid;
  let isNewConfirmedPasswordInvalid;
  let isNewPasswordInvalid;
  let isSubmitting;
  let isSubmitAttempt;
  let message;
  let newConfirmedPassword;
  let newPassword;

  $: isCurrentPasswordInvalid = isSubmitAttempt && currentPassword.length < 6;
  $: isNewPasswordInvalid = isSubmitAttempt && newPassword.length < 6;

  $: isNewConfirmedPasswordInvalid = isSubmitAttempt
    && (newConfirmedPassword.length < 6 || newConfirmedPassword !== newPassword);

  async function onSubmit(event) {
    event.preventDefault();
    isSubmitAttempt = true;
    await tick();

    if (isCurrentPasswordInvalid || isNewPasswordInvalid || isNewConfirmedPasswordInvalid) {
      return;
    }

    isSubmitting = true;

    try {
      await userbase.updateUser({
        currentPassword,
        newPassword,
        username: $user.username,
      });
    } catch (error) {
      isSubmitting = false;

      if (error.name === "UserNotFound" || error.name === "UserNotSignedIn") {
        $user.isAuthenticated = false;
        return;
      }

      switch (error.name) {
        case "CurrentPasswordIncorrect":
          message = "Current Password Incorrect";
          break;
        case "PasswordAttemptLimitExceeded":
          message = "Too Many Attempts";
          break;
        case "TooManyRequests":
          message = "Too Many Attempts";
          break;
        default:
          message = "Network error. Try again?";
          break;
      }

      references.slides.next();
      return;
    }

    isSubmitting = false;
    isSubmitAttempt = false;
    references.slides.next();
    message = "Password Changed";
    currentPassword = "";
    newPassword = "";
    newConfirmedPassword = "";
  }
</script>
