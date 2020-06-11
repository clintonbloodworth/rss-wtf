{#if article}
  <div class="article">
    <button class="button" class:read={article} on:click={on_click}>
      Mark Read
    </button>

    <div class="container">
      <div class="flex-item">
        <Code {theme}>
          <RichText>
            <article lang="{article.language}">
              {@html article.html}
            </article>
          </RichText>
        </Code>
      </div>
    </div>
  </div>
{/if}

<style>
  @import "library/functions";

  .article {
    grid-area: article;
    display: grid;
    grid-template-rows: var(--height) minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    overflow: hidden;
  }

  .flex-item {
    min-width: 0;
  }

  .container {
    overflow: auto;
    max-height: 100%;
    height: max-content;
    padding: 1.6rem 2rem;
    display: flex;
  }

  .button {
    background-color: var(--color-foreground);
    border-bottom: var(--border);
    font-family: var(--font-family-heading);
    font-size: rem(11px);
    font-weight: 700;
    padding: var(--padding);
    text-transform: uppercase;
  }

  article {
    max-width: 60ch;
  }
</style>

<script>
  import Code from 'elements/code';
  import RichText from 'elements/rich-text';
  import { getContext, onMount } from 'svelte';
  import partial from 'lodash-es/partial';
  import userbase from 'userbase-js';
  import md5 from 'md5';

  const feeds = getContext('feeds')
  const state = getContext('state')
  let theme = 'dark';

  $: article = $state.article && $feeds[$state.feed]
    ? $feeds[$state.feed].items[$state.article]
    : null

  function on_click(event) {
    $feeds[$state.feed].items[$state.article].isRead = true;
    $feeds[$state.feed].updated = new Date().toISOString();
  }
</script>
