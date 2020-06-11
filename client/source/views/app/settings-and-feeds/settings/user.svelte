<Slides bind:this={references.slides}>
  <Slide heading="Account">
    <Button label="Sign Out" on:click={signOut} />

    <Button
      isDisabled={$isOffline}
      label="Delete"
      on:click={next} />
  </Slide>

  <Slide heading="You Sure?">
    <Button isDire={true} label="Yes" on:click={deleteAccount} />
    <Button label="No" on:click={partial(previous, undefined)} />
  </Slide>

  <Slide heading={message}>
    <Button label="OK" on:click={partial(previous, 2)} />
  </Slide>
</Slides>

<script>
  import articles from "stores/articles";
  import Button from "components/button";
  import debug from "debug";
  import feeds from "stores/feeds";
  import isOffline from "stores/offline";
  import partial from "library/partial";
  import Slide from "./slide";
  import Slides from "./slides";
  import user from "stores/user";
  import userbase from "library/userbase";
  import { emit } from "library/events";
  import { getContext } from "svelte";

  const log = debug("settings/account");
  const references = {};
  const route = getContext("route");
  let message;
  let timeoutId;

  async function signOut(event) {
    event.preventDefault();

    if (isOffline) {
      Object
        .keys(window.localStorage)
        .filter(key => key.startsWith("userbase"))
        .forEach(key => {
          window.localStorage.removeItem(key);
        });
    } else {
      try {
        await userbase.signOut();
      } catch (error) {
        if (error.name !== "UserNotSignedIn") {
          return;
        }

        throw error;
      }
    }

    $user.isAuthenticated = false;
    route();
  }

  async function deleteAccount() {
    try {
      await userbase.deleteUser();
    } catch (error) {
      if (error.name === "UserNotSignedIn" || error.name === "UserNotFound") {
        $user.isAuthenticated = false;
        return;
      } if (error.name === "TooManyRequests") {
        message = "Too Many Requests";
      } else if (error.name === "ServiceUnavailable") {
        message = "Network Error. Try again?";
      } else {
        message = "Something went wrong. Try again?";
      }

      references.slides.next();
      log("delete account", error.message);
      return;
    }

    emit("reset");
  }

  function previous(steps = 1) {
    clearTimeout(timeoutId);
    references.slides.previous(steps);
  }

  function next() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(previous, 10000);
    references.slides.next();
  }
</script>
