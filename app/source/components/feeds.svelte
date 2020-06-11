<div class="feeds">
  <header class="header">
    <div
      class="header-container"
      class:header-container--editing={is_editing}
      class:header-container--no-feeds={!feeds$.length}>

      {#if feeds$.length}
        <button class="action" on:click={cancel} type="button">
          cancel
        </button>

        <button class="action" on:click={remove} type="button">
          remove

          {#if removes.length}
            ({removes.length})
          {/if}
        </button>
      {/if}

      {#if feeds$.length}
        <button class="action" on:click={edit} type="button">
          edit
        </button>
      {/if}

      <button class="action" on:click={references.modal.show} type="button">
        add
      </button>
    </div>
  </header>

  <button
    class="button everything"
    class:selected={!$state.filter}
    on:click={partial(filter, '')}>

    <div class="image">
      <Logo fill={$state.filter ? '' : 'var(--color-background)'} />
    </div>

   <span class="title" class:selected={!$state.filter}>
    Everything
   </span>

    <span
      class="unread"
      class:hidden={!unread.length}
      class:selected={!$state.filter}>

      {#if unread.length}
        {unread.length}
      {/if}
    </span>
  </button>

  <div class="container">
    <div class="column checkboxes" style="transform: translateX({ translate });">

    {#each feeds$ as feed, index}
      <label
        class="checkbox-label"
        class:selected={$state.filter === feed.url}
        bind:clientWidth={checkbox_width}>

        <input bind:checked={checked[index]} type="checkbox">
      </label>
    {/each}
  </div>

  <div class="column" style="transform: translateX({ translate2 });">
    {#each feeds$ as feed, index}
      <div class="feed">
        <button
          class="button"
          class:selected={$state.filter === feed.url}
          on:click={partial(filter, feed.url, feed)}
          type="button">

          <img alt="" class="image" src="{feed.icon}">

          <span class="title" class:selected={$state.filter === feed.url}>
            {feed.title}
          </span>
        </button>
      </div>
    {/each}
  </div>
    <div class="column unreads" bind:this={references.unreads}>
      {#each feeds$ as feed}
        <span
          class="unread"
          class:hidden={!feed.unread}
          class:selected={$state.filter === feed.url}>

          {#if feed.unread}
            {feed.unread}
          {/if}
        </span>
      {/each}
    </div>
  </div>

  <Modal
    {isLoading}
    {isError}
    bind:this={references.modal}
    on:action={add}
    controls={found}
    on:input={on_input}
    on:submit={search}
    label="url" />
</div>

<style>
  @import "library/functions";

  .feeds {
    grid-area: feeds;
    overflow: hidden;
    height: 100%;
    border-right: var(--border);
    grid-template-columns: 1fr;
    grid-template-rows: var(--height) var(--height) minmax(0, 1fr);
    display: grid;
  }

  .container {
    --padding: 0.35rem 0.55rem;
    --transition: transform 200ms;

    contain: layout;
    display: grid;
    height: 100%;
    list-style-type: none;
    overflow: auto;
    position: relative;
    transition: var(--transition);
    display: grid;
    height: 100%;
  }

  .column {
    display: grid;
    grid-auto-rows: rem(35px);
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    transition: transform 200ms;

    &.checkboxes,
    &.unreads {
      position: absolute;
    }

    &.unreads {
      right: rem(8px);
    }
  }

  .header {
    align-items: center;
    background-color: var(--color-foreground);
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    user-select: none;
  }

  .header {
    background-color: var(--color-foreground);
    border-bottom: var(--border);
    overflow: hidden;
  }

  .header-container {
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    transform: translateX(-100%);
    transition: var(--transition);
    width: 100%;

    &--editing,
    &--no-feeds {
      transform: translateX(0);
    }

    > * {
      flex-shrink: 0;
      width: 50%;
    }

    &--no-feeds {
      > * {
        width: 100%;
      }
    }
  }

  .action {
    font-family: var(--font-family-heading);
    font-size: rem(11px);
    font-weight: 700;
    height: 100%;
    padding: var(--padding);
    text-transform: uppercase;
    user-select: none;

    &:not(:last-child) {
      border-right: var(--border);
    }
  }

  .feed {
    align-items: center;
    border-bottom: var(--border);
    display: flex;
    height: 100%;

    &:hover {
      background-color: var(--color-foreground);
    }
  }

  .checkbox-label {
    padding-left: 10px;
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    border-bottom: var(--border);


    &.selected {
      background-color: var(--color-text);
    }
  }

  .title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;

    &.selected {
      color: var(--color-background);
    }
  }

  .button {
    align-items: center;
    padding-left: 0.55rem;
    padding-right: 0.55rem;
    color: inherit;
    display: flex;
    font-family: var(--font-family-heading);
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    overflow: hidden;
    height: 100%;
    text-align: left;
    user-select: none;
    white-space: nowrap;
    width: 100%;

    &.selected {
      background-color: var(--color-text);
    }

    &.everything {
      border-bottom: var(--border);
      font-weight: 700;
    }
  }

  .unread {
    font-family: var(--font-family-heading);
    font-size: rem(14px);
    padding: 1px 7px;
    margin-left: auto;
    line-height: calc(0.875rem + 3px);
    font-weight: 700;

    &.hidden {
      visibility: hidden;
    }

    &.selected {
      background: var(--color-text);
      color: var(--color-background);
    }
  }

  .image {
    display: flex;
    flex-shrink: 0;
    height: 1.1rem;
    margin-right: 0.5rem;
    object-fit: contain;
    width: 1.1rem;
  }
</style>

<script>
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import Modal from 'components/modal';
  import Logo from 'icons/logo';
  import ky from 'ky';
  import partial from 'lodash-es/partial';

  const references = {};
  const feeds = getContext('feeds');
  const state = getContext('state');
  let feeds$;

  // State
  let checked = [];
  let heading;
  let is_editing;
  let removes = 0;
  let checkbox_width;
  let found = [];
  let isError;
  let isShowModal;
  let database;
  let isLoading;
  let items = [];
  let unread;

  // Computed
  $: unread = Object
    .values($feeds)
    .flatMap(feed => {
      return Object.values(feed.items).filter(item => !item.isRead);
    })
    .sort((a, b) => a.date > b.date ? -1 : 0)

  $: feeds$ = Object
    .values($feeds)
    .sort((a, b) => a.title < b.title ? -1 : 0)
    .map(feed => {
      feed.unread = Object
        .values(feed.items)
        .filter(item => !item.isRead)
        .length

      return feed;
    })

  $: removes = checked.filter(value => value);
  $: translate = is_editing ? 0 : `-${checkbox_width}px`;
  $: translate2 = is_editing ? `${checkbox_width}px` : 0;

  $: {
    if (!references.unreads) {
      break $;
    }

    references.unreads.style.setProperty('--checkbox-width', `${checkbox_width}px`);
  }

  function filter(filter = '', feed) {
    $state.filter = filter;

    if (filter) {
      $state.feed = filter;

      if ($state.history[filter] && $feeds[filter].items[$state.history[filter]]) {
        $state.article = $state.history[filter];
      } else if (Object.values($feeds[filter].items).length) {
        const article = Object
          .values($feeds[feed.url].items)
          .sort((a, b) => a.date > b.date ? -1 : 0)[0]
          .url

        $state.article = article;
        $state.history[filter] = article;
      }
    } else {
      $state.filter = '';

      if ($state.history[filter]) {
        $state.article = $state.history[filter].article;
        $state.feed = $state.history[filter].feed;
      } else if (unread.length) {
        $state.article = unread[0].url;
        $state.feed = unread[0].feed;
        $state.history[filter] = unread[0].url;
      }
    }
  }

  function cancel() {
    is_editing = false;
  }

  function edit() {
    is_editing = true;
  }

  async function remove(event) {
    const removals = feeds$.filter((value, index) => {
      return checked[index];
    });

    if (!removals.length) {
      return;
    }

    for (const removal of removals) {
      delete $feeds[removal.url];
    }

    $feeds = $feeds;
    checked = [];
    is_editing = false;
  }

  async function search(event) {
    found = [];
    isError = false;
    isLoading = true;
    const url = new URL(process.env.API_URL);
    url.pathname = 'feeds';
    url.searchParams.set('url', event.detail);

    let response;

    try {
      response = await ky(url).json();
    } catch (error) {
      isError = true;
      return;
    } finally {
      isLoading = false;
    }

    found = response.feeds;
  }

  function on_input() {
    isError = false;
  }

  async function add(event) {
    isLoading = true;

    // TODO: if there's only one feed, just add?
    const url = new URL(process.env.API_URL);
    url.pathname = 'feed';
    url.searchParams.set('limit', 10);
    url.searchParams.set('url', event.detail.url);
    let response;

    try {
      response = await ky(url).json();
    } catch (error) {
      isError = true;
      return;
    }

    isLoading = false;
    references.modal.hide();
    event.detail.items = response;
    $feeds[event.detail.url] = event.detail;
    $feeds[event.detail.url].updated = new Date().toISOString();
  }
</script>
