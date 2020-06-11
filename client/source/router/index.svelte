<svelte:window on:keydown={onKeydown} on:popstate="{onPopState}" />

<Styles />

<div class="router" class:loading="{$isLoading}">
  {#if route === "/"}
    <Home />
  {:else if route === "/app"}
    <App />
  {:else if route === "/sign-in"}
    <SignIn />
  {:else if route === "/sign-up"}
    <SignUp />
  {:else}
    <NotFound />
  {/if}
</div>

<style>
  .router,
  :global(noscript) {
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-top: env(safe-area-inset-top);

    animation-duration: 40s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    background-image:
      repeating-linear-gradient(
        45deg,
        var(--color-border) 0px,
        var(--color-border) 1px,
        transparent 0%,
        transparent 50%
      );
    background-size: 30px 30px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;
    width: 100vw;

    @keyframes background-position {
      0% {
        background-position: 0% 0%;
      }
      100% {
        background-position: 100% 0%;
      }
    }

    &.loading {
      animation-name: background-position;
    }

    &::after {
      background: linear-gradient(180deg, var(--color-border) var(--border-width), rgb(var(--color-background)) 1px);
      content: "";
      display: block;
      flex-shrink: 0;
      height: env(safe-area-inset-bottom);
      margin-top: auto;
    }

    &::before {
      background: linear-gradient(0deg, var(--color-border) var(--border-width), rgb(var(--color-background)) 1px);
      content: "";
      display: block;
      flex-shrink: 0;
      height: env(safe-area-inset-top);
      margin-bottom: auto;
    }
  }
</style>

<script>
  import App from "views/app";
  import Home from "views/home";
  import isLoading from "stores/loading";
  import NotFound from "views/not-found";
  import SignIn from "views/sign-in";
  import SignUp from "views/sign-up";
  import Styles from "./styles";
  import user from "stores/user";
  import { onMount, setContext, tick } from "svelte";

  setContext("route", route$);
  let route = `/${window.location.pathname.split("/")[1]}`;

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
