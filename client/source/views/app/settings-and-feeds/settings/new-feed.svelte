<Slides bind:this={references.slides} isAnimate={isSubmitting}>
  <Slide heading="New Feed">
    <form 
      bind:this="{references.form}" 
      class="subscribe" 
      on:submit="{onSubmit}">

      <TextField 
        bind:this="{references.url}"
        bind:value="{url}"
        isError={isUrlInvalid}
        label="URL"
        on:input={onInput} />

      <Button isDisabled={$isOffline || isSubmitting} label="Add" type="submit" />
    </form>
  </Slide>

  <Slide heading={message}>
    <Button label="OK" on:click={previous} />
  </Slide>
</Slides>

<style>
  .subscribe {
    display: grid;
    grid-gap: var(--spacing-small);
  }
</style>

<script>
  import articles from "stores/articles";
  import Button from "components/button";
  import endpoints from "library/endpoints";
  import feeds from "stores/feeds";
  import isOffline from "stores/offline";
  import partial from "library/partial";
  import Slides from "./slides";
  import Slide from "./slide";
  import TextField from "components/text-field";
  import { emit } from "library/events";
  import { tick } from "svelte";

  const references = {};
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
      } else if (error.name == "AbortError") {
        isSubmitting = false;
        return;
      } else {
        message = "Network error. Try agin?";
      }

      isSubmitting = false;
      next();
      console.log(error);
      return;
    }

    if (!feeds$.length) {
      isSubmitting = false;
      message = "No Feeds Found";
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
      isSubmitting = false;
      return;
    } if (errors.length === results.length) {
      message = "Network Error. Try agin?";
    } else {
      message = `${results.length} ${results.length > 1 ? "Feeds" : "Feed"} Added`;
      url = "";
    }

    isSubmitting = false;
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
