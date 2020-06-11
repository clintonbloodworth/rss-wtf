<div class="code">
  <slot></slot>
</div>

<style>
  /* stylelint-disable */

  .code {
    display: contents;
  }

  .code :global(code, pre) {
    background-color: var(--color-background-code);
    color: var(--color-code);
    font-family: var(--font-monospace);
    font-size: var(--monospace-font-size-adjust);
    hyphens: none;
    tab-size: 2;
  }

  .code :global(code) {
    border-radius: var(--border-radius-small);
    padding: var(--spacing-miniscule) var(--spacing-small);
  }

  .code :global(pre) {
    border-bottom: var(--border);
    border-top: var(--border);
    hyphens: none;
    margin: var(--spacing-large) calc(var(--spacing-huge) * -1);
    margin-block-end: var(--spacing-medium);
    margin-block-start: var(--spacing-medium);
    overflow: auto;
    padding: var(--spacing-large) var(--spacing-huge);
    box-shadow: var(--box-shadow-code);

    @media (--small) {
      margin: var(--spacing-large) calc(var(--spacing-medium) * -1);
    }
  }

  @media (prefers-color-scheme: light) {
    /*
    github.com style (c) Vasily Polovnyov <vast@whiteants.net>
    */

    .code :global(.hljs-comment),
    .code :global(.hljs-quote) {
      color: #998;
      font-style: italic;
    }

    .code :global(.hljs-keyword),
    .code :global(.hljs-selector-tag),
    .code :global(.hljs-subst) {
      color: #333;
      font-weight: bold;
    }

    .code :global(.hljs-number),
    .code :global(.hljs-literal),
    .code :global(.hljs-variable),
    .code :global(.hljs-template-variable),
    .code :global(.hljs-tag .hljs-attr) {
      color: #008080;
    }

    .code :global(.hljs-string),
    .code :global(.hljs-doctag) {
      color: #d14;
    }

    .code :global(.hljs-title),
    .code :global(.hljs-section),
    .code :global(.hljs-selector-id) {
      color: #900;
      font-weight: bold;
    }

    .code :global(.hljs-subst) {
      font-weight: normal;
    }

    .code :global(.hljs-type),
    .code :global(.hljs-class .hljs-title) {
      color: #458;
      font-weight: bold;
    }

    .code :global(.hljs-tag),
    .code :global(.hljs-name),
    .code :global(.hljs-attribute) {
      color: #000080;
      font-weight: normal;
    }

    .code :global(.hljs-regexp),
    .code :global(.hljs-link) {
      color: #009926;
    }

    .code :global(.hljs-symbol),
    .code :global(.hljs-bullet) {
      color: #990073;
    }

    .code :global(.hljs-built_in),
    .code :global(.hljs-builtin-name) {
      color: #0086b3;
    }

    .code :global(.hljs-meta) {
      color: #999;
      font-weight: bold;
    }

    .code :global(.hljs-deletion) {
      background: #fdd;
    }

    .code :global(.hljs-addition) {
      background: #dfd;
    }

    .code :global(.hljs-emphasis) {
      font-style: italic;
    }

    .code :global(.hljs-strong) {
      font-weight: bold;
    }
  }

  @media (prefers-color-scheme: dark) {
    /*!
     * StackOverflow.com dark style
     *
     * @stackoverflow/stacks v0.56.0
     * https://github.com/StackExchange/Stacks
     */

    .code :global(.hljs-comment) {
      color: #999999;
    }

    .code :global(.hljs-keyword),
    .code :global(.hljs-selector-tag),
    .code :global(.hljs-meta-keyword),
    .code :global(.hljs-doctag),
    .code :global(.hljs-section),
    .code :global(.hljs-selector-class),
    .code :global(.hljs-meta),
    .code :global(.hljs-selector-pseudo),
    .code :global(.hljs-attr) {
      color: #88aece;
    }

    .code :global(.hljs-attribute) {
      color: v#c59bc1;
    }

    .code :global(.hljs-name),
    .code :global(.hljs-type),
    .code :global(.hljs-number),
    .code :global(.hljs-selector-id),
    .code :global(.hljs-quote),
    .code :global(.hljs-template-tag),
    .code :global(.hljs-built_in),
    .code :global(.hljs-title),
    .code :global(.hljs-literal) {
      color: #f08d49;
    }

    .code :global(.hljs-string),
    .code :global(.hljs-regexp),
    .code :global(.hljs-symbol),
    .code :global(.hljs-variable),
    .code :global(.hljs-template-variable),
    .code :global(.hljs-link),
    .code :global(.hljs-selector-attr),
    .code :global(.hljs-meta-string) {
      color: #b5bd68;
    }

    .code :global(.hljs-bullet),
    .code :global(.hljs-code) {
      color: #cccccc;
    }

    .code :global(.hljs-deletion) {
      color: #de7176;
    }

    .code :global(.hljs-addition) {
      color: #76c490;
    }

    .code :global(.hljs-emphasis) {
      font-style: italic;
    }

    .code :global(.hljs-strong) {
      font-weight: bold;
    }
  }
</style>
