<svelte:window on:keydown={onKeydown} on:popstate="{onPopState}" />

<Head />
<Styles />

<div class="router" class:loading="{$isLoading}">
    {#if route === "/"}
      <link rel="stylesheet" href="/fonts/sans-serif/normal/700.css" />
      <link rel="stylesheet" href="/fonts/monospace/normal/500.css" />
      <Home />

      {#if $user.isAuthenticated}
        <link rel="preload" href="/fonts/sans-serif/normal/500.css" as="style">
        <link rel="preload" href="/fonts/monospace/italic/500.css" as="style">
        <link rel="preload" href="/fonts/monospace/normal/700.css" as="style">
        <link rel="preload" href="/fonts/serif.css" as="style">
      {:else}
        <link rel="preload" href="/fonts/monospace/italic/500.css" as="style">
      {/if}
    {:else if route === "/app"}
      <Stylesheets view="app">
        <App />
      </Stylesheets>
    {:else if route === "/policies"}
      <link rel="stylesheet" href="/fonts/serif.css" />
      <Policies />
    {:else if route === "/sign-in"}
      <link rel="stylesheet" href="/fonts/monospace/normal/700.css" />
      <link rel="stylesheet" href="/fonts/monospace/italic/500.css" />
      <SignIn />
    {:else if route === "/sign-up"}
      <link rel="stylesheet" href="/fonts/monospace/normal/500.css" />
      <link rel="stylesheet" href="/fonts/monospace/italic/500.css" />
      <SignUp />
      <link rel="preload" href="/fonts/sans-serif/normal/500.css" as="style">
      <link rel="preload" href="/fonts/serif.css" as="style">
    {:else}
      <link rel="stylesheet" href="/fonts/sans-serif/normal/700.css" />
      <link rel="stylesheet" href="/fonts/monospace/normal/500.css" />
      <NotFound />
    {/if}

  <div 
    class="border" 
    style="--border-radius: var(--border-radius-big);">

    <Border isAnimate={$isLoading} />
  </div>
</div>

<style>
  .router,
  :global(noscript) {
    border-radius: var(--border-radius-big);
    display: flex;
    height: 100%;
    position: relative;
    width: 100%;

    &::before {
      background-image:
        repeating-linear-gradient(
          45deg,
          var(--color-border) 0px,
          var(--color-border) 1px,
          transparent 0%,
          transparent 50%
        );
      background-size: 30px 30px;
      border-radius: var(--border-radius-big);
      content: "";
      height: calc(100% - var(--spacing-small) * 2 - var(--border-width) * 2);
      left: calc(var(--spacing-small) + var(--border-width));
      position: fixed;
      top: calc(var(--spacing-small) + var(--border-width));
      width: calc(100% - var(--spacing-small) * 2 - var(--border-width) * 2);
      z-index: -1;
    }
  }

  .border {
    height: calc(100% - var(--spacing-small) * 2);
    left: var(--spacing-small);
    position: absolute;
    top: var(--spacing-small);
    width: calc(100% - var(--spacing-small) * 2);
    z-index: -1;
  }
</style>

<script>
  import App from "views/app";
  import Border from "components/border";
  import Head from "./head";
  import Home from "views/home";
  import isLoading from "stores/loading";
  import NotFound from "views/not-found";
  import Policies from "views/policies";
  import SignIn from "views/sign-in";
  import SignUp from "views/sign-up";
  import Styles from "./styles";
  import Stylesheets from "./stylesheets";
  import user from "stores/user";
  import { setContext } from "svelte";

  setContext("route", route$);
  let route = `/${window.location.pathname.split("/")[1]}`;

  if (/sign-in|sign-up/.test(route) && $user.isAuthenticated) {
    route$("/app", true);
  } else if (/app/.test(route) && !$user.isAuthenticated) {
    route$("/sign-in", true);
  }

  function route$(pathname = "/", isReplaceState) {
    const url = new URL(pathname, window.location.origin);

    if (isReplaceState) {
      window.history.replaceState({}, "", url.pathname);
    } else {
      window.history.pushState({}, "", url.pathname);
    }

    route = url.pathname;
  }

  function onPopState() {
    route = window.location.pathname;
  }

  function onKeydown(event) {
    if (event.key !== "Escape") {
      return;
    }

    document.body.setAttribute("tabindex", -1);
    document.body.focus();
    document.body.removeAttribute("tabindex");
  }
</script>
