<svelte:head>
  <meta {content} name="theme-color" sizes="any" />
</svelte:head>

<script>
  let content;

  content = window
    .getComputedStyle(window.document.documentElement)
    .getPropertyValue("--color-background");

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addListener(() => {
      content = window
        .getComputedStyle(window.document.documentElement)
        .getPropertyValue("--color-background");
    });
</script>
