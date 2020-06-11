<div
  class:black="{theme === 'black'}"
  class:dark="{theme === 'dark'}"
  class:light="{theme === 'light'}">

  <slot></slot>
</div>

<style>
  .black {
    :global(.hljs) {
      background: #000000;
      color: #f8f8f8;
      display: block;
      overflow-x: auto;
      padding: 0.5em;
    }

    :global(.hljs-comment),
    :global(.hljs-quote),
    :global(.hljs-meta) {
      color: #7c7c7c;
    }

    :global(.hljs-keyword),
    :global(.hljs-selector-tag),
    :global(.hljs-tag),
    :global(.hljs-name) {
      color: #96cbfe;
    }

    :global(.hljs-attribute),
    :global(.hljs-selector-id) {
      color: #ffffb6;
    }

    :global(.hljs-string),
    :global(.hljs-selector-attr),
    :global(.hljs-selector-pseudo),
    :global(.hljs-addition) {
      color: #a8ff60;
    }

    :global(.hljs-subst) {
      color: #daefa3;
    }

    :global(.hljs-regexp),
    :global(.hljs-link) {
      color: #e9c062;
    }

    :global(.hljs-title),
    :global(.hljs-section),
    :global(.hljs-type),
    :global(.hljs-doctag) {
      color: #ffffb6;
    }

    :global(.hljs-symbol),
    :global(.hljs-bullet),
    :global(.hljs-variable),
    :global(.hljs-template-variable),
    :global(.hljs-literal) {
      color: #c6c5fe;
    }

    :global(.hljs-number),
    :global(.hljs-deletion) {
      color: #ff73fd;
    }

    :global(.hljs-emphasis) {
      font-style: italic;
    }

    :global(.hljs-strong) {
      font-weight: bold;
    }
  }

  .dark {
    :global(.hljs-comment),
    :global(.hljs-quote) {
      color: #d4d0ab;
    }

    /* Red */
    :global(.hljs-variable),
    :global(.hljs-template-variable),
    :global(.hljs-tag),
    :global(.hljs-name),
    :global(.hljs-selector-id),
    :global(.hljs-selector-class),
    :global(.hljs-regexp),
    :global(.hljs-deletion) {
      color: #ffa07a;
    }

    /* Orange */
    :global(.hljs-number),
    :global(.hljs-built_in),
    :global(.hljs-builtin-name),
    :global(.hljs-literal),
    :global(.hljs-type),
    :global(.hljs-params),
    :global(.hljs-meta),
    :global(.hljs-link) {
      color: #f5ab35;
    }

    /* Yellow */
    :global(.hljs-attribute) {
      color: #ffd700;
    }

    /* Green */
    :global(.hljs-string),
    :global(.hljs-symbol),
    :global(.hljs-bullet),
    :global(.hljs-addition) {
      color: #abe338;
    }

    /* Blue */
    :global(.hljs-title),
    :global(.hljs-section) {
      color: #00e0e0;
    }

    /* Purple */
    :global(.hljs-keyword),
    :global(.hljs-selector-tag) {
      color: #dcc6e0;
    }

    :global(.hljs) {
      background: #2b2b2b;
      color: #f8f8f2;
      display: block;
      overflow-x: auto;
      padding: 0.5em;
    }

    :global(.hljs-emphasis) {
      font-style: italic;
    }

    :global(.hljs-strong) {
      font-weight: bold;
    }
  }

  .light {
    :global(.hljs) {
      background: #ffffff;
      display: block;
      overflow-x: auto;
      padding: 0.5em;
    }

    :global(.hljs),
    :global(.hljs-subst) {
      color: #434f54;
    }

    :global(.hljs-keyword),
    :global(.hljs-attribute),
    :global(.hljs-selector-tag),
    :global(.hljs-doctag),
    :global(.hljs-name) {
      color: #00979d;
    }

    :global(.hljs-built_in),
    :global(.hljs-literal),
    :global(.hljs-bullet),
    :global(.hljs-code),
    :global(.hljs-addition) {
      color: #d35400;
    }

    :global(.hljs-regexp),
    :global(.hljs-symbol),
    :global(.hljs-variable),
    :global(.hljs-template-variable),
    :global(.hljs-link),
    :global(.hljs-selector-attr),
    :global(.hljs-selector-pseudo) {
      color: #00979d;
    }

    :global(.hljs-type),
    :global(.hljs-string),
    :global(.hljs-selector-id),
    :global(.hljs-selector-class),
    :global(.hljs-quote),
    :global(.hljs-template-tag),
    :global(.hljs-deletion) {
      color: #005c5f;
    }

    :global(.hljs-title),
    :global(.hljs-section) {
      color: #880000;
      font-weight: bold;
    }

    :global(.hljs-comment) {
      color: rgba(149, 165, 166, 0.8);
    }

    :global(.hljs-meta-keyword) {
      color: #728e00;
    }

    :global(.hljs-meta) {
      color: #434f54;
    }

    :global(.hljs-emphasis) {
      font-style: italic;
    }

    :global(.hljs-strong) {
      font-weight: bold;
    }

    :global(.hljs-function) {
      color: #728e00;
    }

    :global(.hljs-number) {
      color: #8a7b52;
    }
  }
</style>

<script>
  // State
  let theme;

  // Exports
  export { theme };
</script>
