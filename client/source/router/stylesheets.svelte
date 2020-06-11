{#each stylesheets as stylesheet}
  <link
    href="{stylesheet.url}"
    on:load={stylesheet.onLoad}
    on:error={stylesheet.onError}
    rel="stylesheet" />
{/each}

{#if isReady}
  <slot></slot>
{/if}

{#each preloads as url}
  <link rel="preload" href="{url}" as="style">
{/each}

<script>
  let isReady;
  let preloads;
  let view;

  const stylesheets = (() => {
    const promises = [];
    let stylesheets;

    switch (view) {
      case "app":
        stylesheets = [
          "/fonts/monospace/italic/500.css",
          "/fonts/monospace/normal/700.css",
          "/fonts/serif.css",
          "/fonts/sans-serif/normal/500.css",
          "/fonts/sans-serif/normal/700.css",
        ];
        break;
      default:
        stylesheets = [];
        break;
    }

    stylesheets = stylesheets.map(url => {
      let onError;
      let onLoad;

      const promise = new Promise((resolve, reject) => {
        onError = reject;
        onLoad = resolve;
      });

      promises.push(promise);

      return {
        onError,
        onLoad,
        url,
      };
    }),

    Promise
      .allSettled(promises)
      .then(results => {
        isReady = true;
      });

    return stylesheets;
  })();

  $: preloads = (() => {
    switch (view) {
      case "app":
        return [
          "/fonts/serif.css",
        ];

      default:
        return [];
    }
  })();

  export {
    view,
  };
</script>
