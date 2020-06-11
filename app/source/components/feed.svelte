{#if items.length}
  <div class="container">
    <button class="button" on:click={mark_all_read} type="button">
      Mark All Read
    </button>

    <ul class="articles">
      {#each items as item (item.url)}
        <li class="item">
          <a
            class="link"
            class:read={item.isRead}
            class:selected={$state.history[$state.filter] === item.url}
            href="{item.url}"
            on:click={partial(open_article, item)}>

            <img
              alt=""
              class="icon"
              class:read={item.isRead}
              src="{item.icon}">

            <span
              class="title"
              class:read={item.isRead}
              class:selected={$state.history[$state.filter] === item.url}>

              {item.title}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  @import "library/functions";
  @import "library/mixins.scss";

  .container {
    grid-area: feed;
    display: grid;
    grid-template-rows: var(--height) minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
  }

  .articles {
    border-right: var(--border);
    list-style-type: none;
    width: 100%;
    overflow: auto;
    height: 100%;
  }

  .icon {
    @include icon();

    flex-shrink: 0;
  }

  .item {
    border-bottom: var(--border);
    height: 48px;
  }

  .link {
    align-items: center;
    display: flex;
    display: flex;
    height: 100%;
    overflow: hidden;
    padding-left: 0.55rem;
    padding-right: 0.55rem;
    position: relative;
    text-decoration: none;
    width: 100%;

    &.selected {
      background-color: var(--color-text);
    }
  }

  .title {
    font-family: var(--font-family-heading);
    font-size: rem(14px);
    font-weight: 500;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;

    &.selected {
      color: var(--color-background);
    }

    &.read {
      opacity: 0.75;
    }
  }

  .button {
    background-color: var(--color-foreground);
    border-bottom: var(--border);
    font-family: var(--font-family-heading);
    font-size: rem(11px);
    font-weight: 700;
    padding: var(--padding);
    text-transform: uppercase;
    border-right: var(--border);
  }
</style>

<script>
  import { getContext } from 'svelte';
  import partial from 'lodash-es/partial';
  const feeds = getContext('feeds');
  const state = getContext('state');

  $: items = $state.filter && $feeds[$state.filter] && $feeds[$state.filter]
    ? Object
      .values($feeds[$state.filter].items)
      .map((item) => {
        item.icon = $feeds[$state.filter].icon;
        item.feed = $feeds[$state.filter].url;
        return item;
      })
    : Object
      .values($feeds)
      .flatMap(feed => {
        return Object
          .values(feed.items)
          .map((item) => {
            item.icon = feed.icon;
            item.feed = feed.url;
            return item;
          });
      })
      .sort((a, b) => a.date > b.date ? -1 : 0)

  function mark_all_read() {
    items.forEach(item => {
      item.isRead = true;
    });

    $feeds[$state.filter].items = $feeds[$state.filter].items
  }

  function open_article(item, event) {
    event.preventDefault();
    $state.article = item.url;
    $state.history[$state.filter] = item.url;
    $state.feed = item.feed;
  }
</script>
