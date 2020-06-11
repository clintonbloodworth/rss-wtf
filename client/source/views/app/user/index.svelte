<div
  bind:this="{references.container}"
  class="container"
  on:scroll="{debounce(onScroll, 100)}"
  use:restoreScroll>

  <div class="header">
    <Header aside={$user.username}>
      <h2>
        User
      </h2>
    </Header>
  </div>  

  <ChangePassword />
  <SignOut />
  <DeleteUser />
</div>

<style>
  .container {
    display: grid;
    grid-area: user;
    grid-gap: var(--spacing-medium);
    padding-right: var(--spacing-large);

    /*
      This gives us a little grid gap at the bottom. Which in turn
      creates a nice little gap for overflow scrolling.
    */

    &::after {
      content: "";
      height: 1px;
    }

    @media (--small) {
      --spacing-left: var(--spacing-small);

      margin-left: 0px;
      padding-top: var(--spacing-small);
    }
  }

  .header {
    scroll-snap-align: start;
  }
</style>

<script context="module">
  import { on } from "library/events";
  import { writable } from "library/store";

  const store = writable({}, {
    adapter: "ls",
    name: "views/app/settings-and-feeds",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import articles from "stores/articles";
  import ChangePassword from "./change-password";
  import debounce from "library/debounce";
  import DeleteUser from "./delete-user";
  import feeds from "stores/feeds";
  import Header from "components/header";
  import SignOut from "./sign-out";
  import user from "stores/user";
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { isChrome } from "library/browser";

  const dispatch = createEventDispatcher();
  const references = {};

  function onScroll(event) {
    $store.x = event.target.scrollLeft;
    $store.y = event.target.scrollTop;
  }

  async function restoreScroll(container) {
    await feeds.ready;
    await tick();

    container.style.overflow = "hidden"; // Prevents scrollbar flash after setting `scrollTop`.
    container.scrollLeft = $store.x;
    container.scrollTop = $store.y;

    setTimeout(() => {
      container.style.overflow = "";
    });
  }
</script>
