<Button label="Sign Out" on:click={signOut} />

<script>
  import Button from "components/button";
  import feeds from "stores/feeds";
  import isOffline from "stores/offline";
  import user from "stores/user";
  import userbase from "library/userbase";
  import { getContext } from "svelte";

  const references = {};
  const route = getContext("route");
  let timeoutId;

  async function signOut(event) {
    event.preventDefault();

    if ($isOffline) {
      Object
        .keys(window.localStorage)
        .filter(key => key.startsWith("userbase"))
        .forEach(key => {
          window.localStorage.removeItem(key);
        });
    } else {
      tryCatch: try {
        await userbase.signOut();
      } catch (error) {
        if (error.name === "UserNotSignedIn") {
          break tryCatch;
        }

        throw error;
      }
    }

    $user.isAuthenticated = false;
    route();
  }
</script>
