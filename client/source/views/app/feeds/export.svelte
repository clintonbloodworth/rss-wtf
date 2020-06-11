<div class="container">
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- `tabindex="0"` compensates for the missing `href`, which is generated on "click". -->
  <Button>
    <a
      bind:this="{references.anchor}"
      class="export"
      on:click="{export$}"
      download="wtf.xml"
      tabindex="0">

      Export
    </a>
  </Button>
</div>

<style>
 .container {
   margin-bottom: var(--spacing-medium);
 }

 .export {
   text-decoration: none;
 }
</style>

<script>
 import Button from "mixins/button";
 import feeds from "stores/feeds";

 const references = {};

 function export$() {
   const document$ = document.implementation.createDocument(null, "opml");
   document$.documentElement.setAttribute("version", "2.0");

   // Required by the specification.
   const head = document$.createElement("head");
   document$.documentElement.appendChild(head);

   const body = document$.createElement("body");
   document$.documentElement.appendChild(body);

   for (const feed of Object.values($feeds)) {
     const outline = document$.createElement("outline");
     outline.setAttribute("text", feed.title); // Required by the specification.
     outline.setAttribute("title", feed.title);
     outline.setAttribute("type", "rss");
     outline.setAttribute("xmlUrl", feed.url);
     body.appendChild(outline);
   }

   const blob = new Blob([document$.documentElement.outerHTML], {
     type: "application/xml; charset=utf-8",
   });

   const url = URL.createObjectURL(blob);
   references.anchor.href = url;

   setTimeout(() => {
     // TODO: test this.
     URL.revokeObjectURL(url);
   });
 }
</script>
