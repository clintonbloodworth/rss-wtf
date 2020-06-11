<Button 
  bind:isConfirming={isUnsubscribeConfirming}
  isDangerous={true}
  isRequiresConfirmation={true}
  isDisabled={$isOffline} 
  label="Delete Account" />

<script>
  import Button from "components/button";
  import isOffline from "stores/offline";
  import user from "stores/user";
  import userbase from "library/userbase";
  import { emit } from "library/events";
  import { getContext } from "svelte";

  const references = {};
  const route = getContext("route");
  let isUnsubscribeConfirming;
  let message;

  async function deleteAccount() {
    if (!isUnsubscribeConfirming) {
      return;
    }

    try {
      await userbase.deleteUser();
    } catch (error) {
      if (error.name === "UserNotSignedIn" || error.name === "UserNotFound") {
        $user.isAuthenticated = false;
        return;
      }

      switch (error.name) {
        case "TooManyRequests":
          message = "Too Many Requests";
          break;
        case "ServiceUnavailable":
          message = "Network Error. Try again?";
          break;
        default:
          message = "Something went wrong. Try again?";
          break;
      }

      throw error;
    }

    emit("reset");
    route();
  }
</script>
