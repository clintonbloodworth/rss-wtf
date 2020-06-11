<div class="container">
  <Slider 
    {slides}
    bind:this={references.slides} 
    let:index>

    {#if index === 0}
      <form bind:this="{references.form}" on:submit="{onSubmit}">
        <TextField
          bind:this="{references.url}"
          bind:value="{url}"
          isError={isUrlInvalid}
          label="URL"
          on:input={onInput} />

        <Button isDisabled={$isOffline || isSubmitting} label="Subscribe" type="submit" />
      </form>
    {:else}
      <h3>
        {message}
      </h3>

      <Button label="OK" on:click={previous} />
    {/if}
  </Slider>
</div>

<style>
  .container {
    margin-bottom: var(--spacing-small);
  }

  form {
    display: grid;
    grid-gap: var(--spacing-small);
  }
</style>

<script context="module">
  import { writable } from "library/store";
  import { emit, on } from "library/events";

  const store = writable({}, {
    adapter: "ls",
    name: "views/app/feeds",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import articles from "stores/articles";
  import Button from "components/button";
  import endpoints from "library/endpoints";
  import feeds from "stores/feeds";
  import isLoading from "stores/loading";
  import isOffline from "stores/offline";
  import partial from "library/partial";
  import Slider from "../slider";
  import TextField from "components/text-field";
  import { tick } from "svelte";

  const references = {};
  const slides = 2;
  let found = [];
  let isSubmitting;
  let isSubmitAttempt;
  let isUrlInvalid;
  let message;
  let requests = [];
  let url = "";

  $: isUrlInvalid = isSubmitAttempt && !/.+\..+/.test(url);

  async function onSubmit(event) {
    event.preventDefault();
    isSubmitAttempt = true;
    await tick();

    if (isUrlInvalid) {
      return;
    }

    found = [];
    requests = [];
    isSubmitting = true;
    $isLoading = true;

    const request = endpoints.feeds({
      query: {
        url,
      },
    });

    requests.push(request);
    let feeds$;

    try {
      feeds$ = await request;
    } catch (error) {
      if (error.name === 404) {
        message = "No Feeds Found";
      } else if (error.name === "AbortError") {
        isSubmitting = false;
        return;
      } else {
        message = "Something Went Wrong";
      }

      isSubmitAttempt = false;
      isSubmitting = false;
      $isLoading = false;
      next();
      throw error;
    }

    if (!feeds$.length) {
      isSubmitAttempt = false;
      isSubmitting = false;
      message = "No Feeds Found";
      $isLoading = false;
      next();
      return;
    }

    const results = await Promise.allSettled(
      feeds$
        .filter(feed => !$feeds[feed.url])
        .map(async feed => {
          const request = endpoints.articles({
            query: {
              url: feed.url,
            },
          });

          requests.push(request);
          const articles$ = await request;
          emit("feed.add", feed);
          emit("articles.add", articles$);
        }),
    );

    const errors = results
      .filter(result => result.status === "rejected")
      .map(result => result.reason);

    const isAbort = errors.some(error => error.name === "AbortError");

    if (isAbort) {
      isSubmitAttempt = false;
      isSubmitting = false;
      $isLoading = false;
      return;
    } if (errors.length === results.length) {
      message = "Something Went Wrong";
    } else {
      message = `${results.length} ${results.length > 1 ? "Feeds" : "Feed"} Added`;
      url = "";
    }

    isSubmitAttempt = false;
    isSubmitting = false;
    $isLoading = false;
    next();
  }

  function previous() {
    isSubmitAttempt = false;
    references.slides.previous();
  }

  function next() {
    references.slides.next();
  }

  function onInput() {
    requests.forEach(request => {
      request.abort();
    });

    requests = [];
  }

  export {
    url,
  };
</script>
