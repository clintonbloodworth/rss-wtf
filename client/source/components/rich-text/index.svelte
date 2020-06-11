<div class="rich-text">
  <Code>
    <slot />
  </Code>
</div>

<style>
  /* stylelint-disable no-descending-specificity */

  /* blockquote uses custom color? */

  /* link color shouldn't be full white */

  .rich-text {
    --spacing-shit: 38px;

    background: rgb(var(--color-background));
    border: var(--border);
    border-radius: var(--border-radius);
    box-sizing: content-box;
    box-shadow: var(--box-shadow);
    color: rgb(var(--color-foreground));
    font-family: var(--font-serif);
    font-size: 22px;
    hyphens: auto;
    line-height: 1.6;
    max-width: 60ch;
    overflow-wrap: break-word;
    padding: var(--spacing-huge);

    @media (--medium) {
      padding-left: var(--spacing-large);
      padding-right: var(--spacing-large);
    }

    @media (--small) {
      font-size: 20px;
      padding-left: var(--spacing-medium);
      padding-right: var(--spacing-medium);
      max-width: initial;
    }

    @media (prefers-color-scheme: dark) {
      -webkit-font-smoothing: antialiased;
    }

    & :global(article > :first-child) {
      &:not(h1) {
        margin-block-start: 0;
      }
    }

    & :global(article > br) {
      display: none;
    }

    & :global(article > :last-child:not(h1)) {
      margin-block-end: 0 !important;
    }

    & :global(article > :last-child *) {
      margin-block-end: 0;
    }

    :global(a) {
      color: rgb(var(--color-foreground));
      text-decoration-color:  var(--color-border);
      transition: text-decoration-color 200ms;

      &:hover {
        text-decoration-color: rgb(var(--color-foreground));
      }

      &:visited {
        color: var(--color-link-visited);
      }
    }

    :global(audio) {
      margin-inline-end: var(--spacing-medium);
      margin-inline-start: var(--spacing-medium);

      @media print {
        display: none;
      }
    }

    :global(blockquote) {
      border-inline-start: var(--border);
      display: block;
      margin-block-end: var(--spacing-large);
      margin-block-start: var(--spacing-large);
      padding-inline-start: var(--spacing-large);
    }

    :global(blockquote img) {
      height: auto !important;
      max-width: 100%;
      width: auto !important;
    }

    :global(dd) {
      border-inline-start: 6px dashed rgb(var(--color-background));
      padding-inline-start: var(--spacing-large);

      &:not(:last-of-type) {
        margin-block-end: var(--spacing-medium);
      }
    }

    :global(dl) {
      margin-block-end: var(--spacing-large);
      overflow: hidden;
    }

    :global(dt) {
      font-weight: 700;
      margin-block-end: var(--spacing-medium);
    }

    :global(figcaption) {
      font-style: italic;
      margin-block-start: var(--spacing-medium);
      margin-inline-end: auto;
      margin-inline-start: auto;
      width: fit-content;
    }

    :global(figure) {
      font-size: var(--font-size-small);
      text-align: center;
    }

    :global(figure p) {
      margin-block-end: var(--spacing-small);
      margin-block-start: var(--spacing-small);
    }

    :global(figure figcaption + cite) {
      /* https://www.polygon.com/2020/5/25/21266228/ring-fit-adventure-quarantine-fitness-toxicity-nintendo-switch; */
      margin-block-start: 0;
    }

    :global(figure cite, figure em, figure small) {
      display: block;
      font-size: var(--font-size-medium);
      margin-block-start: var(--spacing-medium);
      margin-inline-end: auto;
      margin-inline-start: auto;
      width: fit-content;
    }

    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      font-family: var(--font-sans-serif);
      hyphens: none;
      line-height: 1.15;
      margin-block-end: var(--spacing-large);
      margin-block-start: var(--spacing-large);
    }

    :global(h1) {
      font-size: 46px;
      line-height: 1.1;
      margin-block-start: 0;

      @media (--small) {
        font-size: 38px;
      }
    }

    :global(h2) {
      font-size: 38px;
    }

    :global(h3) {
      font-size: 32px;
    }

    :global(h4) {
      font-size: 25px;
    }

    :global(h5) {
      font-size: 20px;
    }

    :global(h6) {
      font-size: var(--font-size-medium);
      margin-block-end: var(--spacing-small);
      margin-block-start: var(--spacing-small);
    }

    :global(kbd) {
      background-color: rgb(var(--color-background));
      border-radius: var(--border-radius);
      font-family: var(--font-monospace);
      font-size: var(--monospace-font-size-adjust);
      hyphens: none;
      padding: var(--monospace-inline-spacing);
    }

    :global(iframe) {
      border-radius: var(--border-radius-media);
      display: block;
      margin: var(--spacing-large) auto;
      width: 100%;

      @media print {
        display: none;
      }
    }

    :global(img) {
      /* todo: why? for fallback text? */
      background-color: rgb(var(--color-background));
      display: block;
      max-width: 100%;

      @media print {
        height: auto !important;
        max-width: 100%;
      }
    }

    :global(li) {
      margin-block-end: var(--spacing-small);

      &:last-child {
        margin-block-end: 0;
      }
    }

    :global(mark) {
      @media (prefers-color-scheme: dark) {
        background-color: rgb(var(--color-background));
      }
    }

    :global(ol) {
      margin-block-start: var(--spacing-medium);
      padding-inline-start: var(--spacing-large);
    }

    :global(ol ol) {
      margin-block-start: var(--spacing-small);
      padding-inline-start: var(--spacing-medium);
    }

    :global(p) {
      margin-block-end: var(--spacing-medium);
      margin-block-start: var(--spacing-medium);
    }

    :global(picture) {
      align-items: center;
      display: flex;
      flex-direction: column;
      margin: var(--spacing-medium) calc(var(--spacing-huge) * -1);

      @media (--medium) {
        margin: var(--spacing-medium) calc(var(--spacing-large) * -1);
      }

      @media (--small) {
        margin: var(--spacing-large) calc(var(--spacing-medium) * -1);
      }
    }

    :global(pre a) {
      text-decoration: underline;
    }

    :global(samp) {
      background-color: rgb(var(--color-background));
      border-radius: var(--border-radius);
      font-family: var(--font-monospace);
      font-size: var(--monospace-font-size-adjust);
      hyphens: none;
      padding: var(--monospace-inline-spacing);
    }

    :global(small) {
      font-style: italic;
    }

    :global(svg) {
      display: block;
      margin-block-end: var(--spacing-medium);
      margin-block-start: var(--spacing-medium);
    }

    :global(table) {
      border-collapse: collapse;
      font-family: var(--font-monospace);
      font-size: var(--monospace-font-size-adjust);
      margin-block-end: var(--spacing-medium);
      margin-block-start: var(--spacing-medium);
      min-width: var(--body-width);
    }

    :global(table caption) {
      padding: var(--spacing-medium);
    }

    :global(table code) {
      font-size: 100%;
    }

    :global(table pre) {
      /* todo: find an example of this. consider moving to code.svelte. */
      font-size: 100%;
      margin-block-end: 0;
      margin-block-start: 0;
      padding: 0;
    }

    :global(table ol, table ul) {
      margin-block-start: 0;
      margin-inline-start: 0;
      padding-inline-start: var(--spacing-medium);
    }

    :global(td) {
      border: var(--border);
      padding: var(--spacing-medium);
      text-align: left;
    }

    :global(th) {
      background-color: rgb(var(--color-background));
      border: var(--border);
      padding: var(--spacing-small) var(--spacing-medium);
      text-align: left;
      white-space: nowrap;

      &:not(:first-child) {
        border-left-color: rgb(var(--color-foreground));
      }

      &:not(:last-child) {
        border-right-color: rgb(var(--color-foreground));
      }
    }

    :global(thead th) {
      background-color: rgb(var(--color-background));
    }

    :global(tr) {
      border: var(--border);
    }

    :global(time) {
      font-style: italic;
    }

    :global(ul) {
      margin-block-start: var(--spacing-medium);
      padding-inline-start: var(--spacing-large);
    }

    :global(ul ul) {
      margin-block-start: var(--spacing-small);
      padding-inline-start: var(--spacing-medium);
    }

    :global(video) {
      border-radius: var(--border-radius-media);
      display: block;
      margin: var(--spacing-large) auto;
      max-width: 100%;
    }

    :global(&) {
      :empty:not(audio):not(br):not(figure):not(iframe):not(img):not(picture):not(source):not(td):not(th):not(video) {
        display: none;
      }
    }
  }
</style>

<script>
  import Code from "./code";
</script>
