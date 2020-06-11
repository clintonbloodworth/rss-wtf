<div 
  class="container" 
  on:scroll="{debounce(onScroll, 500)}"
  use:restoreScroll>

  <VisuallyHidden>
    <h1>
      Policies
    </h1>
  </VisuallyHidden>

  <Heading>
    <h2>
      Privacy
    </h2>
  </Heading>

  <RichText>
    <article>
      <p>
        Qui quae a quo. Fugit soluta provident voluptates nobis.
        Voluptatibus ducimus nisi fugiat laudantium. Voluptates in saepe ad
        veritatis ea voluptas fuga. Facilis dolores velit sequi et hic autem
        aut. Aut quia ad atque eos omnis molestiae vel sequi.
      </p>

      <p>
        Ex ex qui nostrum. Quasi aut fugiat repudiandae sunt pariatur
        doloremque voluptates ipsum. Aspernatur dolores enim rerum harum.
      </p>

      <p>
        Velit nam molestiae enim ut. Rerum omnis rerum perferendis adipisci
        nesciunt maxime. Qui veniam repellendus quibusdam eum quo non
        aliquam corrupti. Dicta ea ea iure sequi dolores. Optio quibusdam
        totam earum incidunt. Itaque est possimus qui aperiam quo voluptate.
      </p>

      <p>
        Est laudantium non quia assumenda et odit natus quibusdam. Odit
        ipsam ut in. Est saepe in modi qui quod doloribus ratione animi.
        Nisi cumque cum labore itaque saepe quaerat perspiciatis. Quod omnis
        aut voluptas voluptas maiores ad quia omnis. Laudantium ea optio
        iste.
      </p>

      <p>
        Voluptatem sit ipsa facilis reiciendis voluptatibus. Nesciunt sint
        non aliquid commodi consequatur molestiae cupiditate. Qui ullam
        sequi explicabo. Fugit deleniti nam inventore ducimus quae.
      </p>
    </article>
  </RichText>

  <Heading>
    <h2>Terms</h2>
  </Heading>

  <RichText>
    <article>
      <p>
        Qui quae a quo. Fugit soluta provident voluptates nobis.
        Voluptatibus ducimus nisi fugiat laudantium. Voluptates in saepe ad
        veritatis ea voluptas fuga. Facilis dolores velit sequi et hic autem
        aut. Aut quia ad atque eos omnis molestiae vel sequi.
      </p>

      <p>
        Ex ex qui nostrum. Quasi aut fugiat repudiandae sunt pariatur
        doloremque voluptates ipsum. Aspernatur dolores enim rerum harum.
      </p>

      <p>
        Velit nam molestiae enim ut. Rerum omnis rerum perferendis adipisci
        nesciunt maxime. Qui veniam repellendus quibusdam eum quo non
        aliquam corrupti. Dicta ea ea iure sequi dolores. Optio quibusdam
        totam earum incidunt. Itaque est possimus qui aperiam quo voluptate.
      </p>

      <p>
        Est laudantium non quia assumenda et odit natus quibusdam. Odit
        ipsam ut in. Est saepe in modi qui quod doloribus ratione animi.
        Nisi cumque cum labore itaque saepe quaerat perspiciatis. Quod omnis
        aut voluptas voluptas maiores ad quia omnis. Laudantium ea optio
        iste.
      </p>

      <p>
        Voluptatem sit ipsa facilis reiciendis voluptatibus. Nesciunt sint
        non aliquid commodi consequatur molestiae cupiditate. Qui ullam
        sequi explicabo. Fugit deleniti nam inventore ducimus quae.
      </p>
    </article>
  </RichText>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: max-content;
    justify-content: center;
    overflow-y: auto;
    padding-top: var(--spacing-large);
    width: 100%;

    &::after {
      content: "";
      height: var(--spacing-large);
    }
  }

  h2 {
    font-size: 48px;
    margin-bottom: var(--spacing-large);
    margin-top: var(--spacing-large);
  }
</style>

<script context="module">
  import { on } from "library/events";
  import writable from "library/writable";
  import Heading from "mixins/heading";
  import VisuallyHidden from "mixins/visually-hidden";
  import debounce from "library/debounce";

  const store = writable({}, {
    adapter: "ls",
    name: "routes/policies",
  });

  on("reset", () => {
    store.set({});
  });
</script>

<script>
  import RichText from "components/rich-text";

  function restoreScroll(policies) {
    policies.scrollLeft = $store.x;
    policies.scrollTop = $store.y;
  }

  function onScroll(event) {
    $store.x = event.target.scrollLeft;
    $store.y = event.target.scrollTop;
  }
</script>
