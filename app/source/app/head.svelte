<svelte:head>
  <meta name="theme-color" content="{theme}">
  <link rel="icon" href="{process.env.GRAPHICS_URL}/favicon.svg" type="image/svg+xml">
  <link rel="mask-icon" href="{process.env.GRAPHICS_URL}/safari.svg" color="#000000">

  {#if process.env.NODE_ENV === 'development'}
    <link rel="stylesheet" href="https://cloud.typography.com/7341356/7378212/css/fonts.css">
  {/if}
</svelte:head>

<script>
  let theme;
  export { theme };
</script>
