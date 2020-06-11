<Head theme={backgroundColor} />

<div class="app">
  {#if $state.isAuthenticated}
    <Authenticated />
  {:else}
    <Anonymous />
  {/if}
</div>

<style>
  @import "library/functions";
  @import "library/mixins.scss";

  .app {
    background-color: var(--color-background);
    display: flex;
    height: 100vh;
    width: 100vw;
  }
</style>

<script>
  import './global';
  import './reset';
  import { setContext } from 'svelte';
  import Head from './head';
  import Anonymous from 'views/anonymous';
  import Authenticated from 'views/authenticated';
  import userbase from 'userbase-js';

  window.debug = debug;
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const fullscreen = window.matchMedia('(display-mode: fullscreen)');
  const isChromeDesktop = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Android');
  const light = window.matchMedia('(prefers-color-scheme: light)');

  let backgroundColor;
  let feeds;
  let mode = light.matches ? 'light' : 'dark';
  let settings;
  let state;
  let theme;

  setContext('feeds', feeds);
  setContext('settings', settings);
  setContext('state', state);

  $: {
    // TODO: why does this work? why does settings theme first and here ensure that
    // --color-background has been set. there's no await tick here.
    theme = mode;
    backgroundColor = window.getComputedStyle(window.document.documentElement).getPropertyValue('--color-background');
    window.document.documentElement.setAttribute('theme', theme);
    // textColor = window.getComputedStyle(app).getPropertyValue('--color-text');

    if (!$settings.theme) {
      $settings.theme = theme;
    }
  }

  light.addListener(event => {
    if (!event.matches) {
      return;
    }

    mode = 'light';
  });

  dark.addListener(event => {
    if (!event.matches) {
      return;
    }

    mode = 'dark';
  });

  function debug() {
    $state.isDebug = !$state.isDebug;
    return $state.isDebug;
  }

  export {
    feeds,
    settings,
    state,
  }
</script>
