<div class="header">
  <Heading>
    <h2>
      Settings
    </h2>
  </Heading>

  <div class="username-container" use:setColor>
    <p class="username">
      {$user.username}
    </p>
  </div>
</div>

<User />
<ImportAndExport />
<Payment />
<Password />
<NewFeed bind:url={$store.url} />

<style>
  .header {
    --margin-top: calc(var(--spacing-small) + var(--spacing-large));

    margin-top: var(--margin-top);
    max-width: 100%;
    overflow: hidden;
    scroll-margin-top: var(--margin-top);
    scroll-snap-align: start;
    scroll-snap-margin-top: var(--margin-top);
  }

  .username-container {
    align-items: center;
    display: grid;
    grid-template-columns: min-content minmax(0, min-content) min-content;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--spacing-tiny);
    max-width: 80%;
    overflow: hidden;

    &::before {
      color: var(--color);
      content: "(";
      display: inline-block;
    }

    &::after {
      color: var(--color);
      content: ")";
      display: inline-block;
    }
  }

  .username {
    display: inline-block;
    font-family: var(--font-monospace);
    font-size: var(--font-size-small);
    font-style: italic;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
</style>

<script context="module">
  import { on } from "library/events";
  import ColorHash from "color-hash";
  import writable from "library/writable";

  const store = writable({}, {
    adapter: "ls",
    name: "views/app/settings-and-feeds/settings",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import Heading from "mixins/heading";
  import ImportAndExport from "./import-and-export";
  import NewFeed from "./new-feed";
  import Password from "./password";
  import Payment from "./payment";
  import User from "./user";
  import user from "stores/user";

  function setColor(username) {
    const colorHash = new ColorHash();
    const color = colorHash.hex($user.username)
    username.style.setProperty("--color", color);
  }
</script>
