<div class="rich-text">
  <slot></slot>
</div>

<style>
/* stylelint-disable no-descending-specificity */

.rich-text {
  color: var(--color-text);
  display: contents;
  font-family: var(--font-family-body);
  font-size: 1.4rem;

  :global(:not(pre) > code) {
    background-color: var(--color-code-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    font-size: 0.7em;
    padding: 0.1rem 0.3rem;
  }

  :global(a) {
    color: var(--color-link);
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:visited {
      color: var(--color-link-visited);
    }
  }

  :global(blockquote) {
    border-left: 1px solid var(--color-text);
    margin-left: 1rem;
    padding-left: 1rem;
  }

  :global(code) {
    font-family: var(--font-family-code);
  }

  :global(dl) {
    font-size: 1.3rem;
  }

  :global(dt) {
    margin-top: 2.5rem;
  }

  :global(dd) {
    margin-top: 2rem;
  }

  :global(h1) {
    font-family: var(--font-family-heading);
    font-size: 2.8rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  :global(h1 a) {
    color: inherit;
    font-family: inherit;
    font-weight: inherit;

    &:visited {
      color: inherit;
    }
  }

  :global(h1 + p) {
    margin-top: 0.8rem;
  }

  :global(h2) {
    font-family: var(--font-family-heading);
    font-size: 2rem;
    line-height: 1.2;
    margin-top: 1.8rem;
  }

  :global(h2 + p) {
    margin-top: 0.5rem;
  }

  :global(h3) {
    font-family: var(--font-family-heading);
    font-size: 1.3rem;
    line-height: 1.2;
    margin-top: 1rem;
  }

  :global(h3 + p) {
    margin-top: 0.5rem;
  }

  :global(h4) {
    font-family: var(--font-family-heading);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.2;
  }

  :global(h4 + p) {
    margin-top: 0.5rem;
  }

  :global(p) {
    font-size: 1.3rem;
    line-height: 1.6;
    margin-bottom: 0;
    margin-top: 1rem;
    padding-left: var(--spacing);
    padding-right: var(--spacing);
  }

  :global(pre) {
    background-color: var(--color-background);
    border-radius: var(--border-radius);
    font-size: 1.1rem;
    line-height: 1.6;
    overflow: auto;
    padding: 1rem;
  }

  :global(p:only-child) {
    margin-bottom: 0;
    margin-top: 0;
  }

  :global(iframe) {
    border: none;
    border-radius: var(--border-radius);
    margin-left: var(--spacing);
    margin-right: var(--spacing);
    width: 100%;
  }

  :global(img) {
    border-radius: var(--border-radius);
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    max-width: 100%;
  }

  :global(li) {
    display: table-row;
    font-size: 1.3rem;
    line-height: 1.2;
  }

  :global(li::before) {
    content: "•";
    display: table-cell;
    padding-right: 1em;
  }

  :global(ol li) {
    counter-increment: ol;
  }

  :global(ol li::before) {
    content: counter(ol) ".";
    display: table-cell;
    text-align: right;
  }

  :global(ol),
  :global(ul) {
    border-spacing: 0 0.6rem;
    margin-top: 1.2rem;
    width: 100%;
  }

  :global(table) {
    border-collapse: collapse;
    border-spacing: 0;
    margin-left: var(--spacing);
    margin-right: var(--spacing);
    margin-top: 1rem;
  }

  :global(td),
  :global(th) {
    border-bottom: 1px solid var(--color-text);
    font-size: 1.2rem;
    line-height: 1.6;
    padding: 1rem;
    text-align: left;
  }

  :global(td:first-child, td:first-child) {
    padding-left: 0;
  }

  :global(td:last-child, td:last-child) {
    padding-right: 0;
  }
}
</style>
