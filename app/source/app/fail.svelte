<main>
  <h1>
    <a href="mailto:support@rss.wtf?subject=Shit&body=Error: {error.message}.">
      Shit.
    </a>
  </h1>
</main>

<style>
  main {
    align-items: center;
    background-color: var(--color-background);
    color: var(--color-text);
    display: flex;
    height: 100vh;
    justify-content: center;
    width: 100vw;
  }

  h1 {
    font-family: var(--font-family-heading);
    font-size: 3.5rem;
    margin-bottom: 10vh;
    width: min-content;
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>

<script>
  // State
  let error;

  // Exports
  export { error };
</script>
