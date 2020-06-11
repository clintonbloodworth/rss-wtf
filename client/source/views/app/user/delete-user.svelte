<Button 
  bind:isConfirming={isUnsubscribeConfirming}
  isDangerous={true}
  isRequiresConfirmation={true}
  isDisabled={$isOffline} 
  label="Delete Account"
  on:click={deleteAccount} />

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
    console.log("yo");
    if (!isUnsubscribeConfirming) {
      console.log("return");
      return;
    }

    tryCatch: try {
      await userbase.deleteUser();
    } catch (error) {
      if (error.name === "UserNotSignedIn" || error.name === "UserNotFound") {
        $user.isAuthenticated = false;
        break tryCatch;
      }

      throw error;
    }

    emit("reset");
    route();
  }
</script>
