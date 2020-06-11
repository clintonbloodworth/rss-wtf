<style>
  :global(html) {
    --border-color: var(--color-border);
    --border-radius-big: 10px;
    --border-radius-small: 10px;
    --border-style: solid;
    --border-width: 1px;
    --border: var(--border-width) var(--border-style) var(--color-border);
    --box-shadow-code: 2px 2px 1px rgba(var(--color-foreground), 0.02);
    --color-background-code: #f8f8f8;
    --color-background: var(--color-white);
    --color-black: 70, 70, 70;
    --color-blue: #7d7dff;
    --color-border: rgba(var(--color-foreground), 0.2);
    --color-code: #333333;
    --color-foreground: var(--color-black);
    /*
      It would be nice to use `rgba` plus `--color-foreground` here.
      But visited link styling is restricted by browsers to prevent
      sites from figuring out a user's browsing history. Alternatively,
      `text-decoration: wavy` would be sweet to use instead of a color
      change. But it's not well supported.
    */
    --color-link-visited: #a2a2a2;
    --color-red: #ff5656;
    --color-white: 255, 255, 255;
    --focus-outline-width: 2px;
    --font-monospace: "Operator Mono A", "Operator Mono B", monospace;
    --font-sans-serif: "Ideal Sans A", "Ideal Sans B", sans-serif;
    --font-serif: "Sentinel A", "Sentinel B", serif;
    --font-size-tiny: 12px;
    --font-size-small: 14px;
    --font-size-medium: 16px;
    --font-size-large: 18px;
    --monospace-font-size-adjust: 75%;
    --spacing-huge: 32px;
    --spacing-large: 24px;
    --spacing-medium: 14px;
    --spacing-miniscule: 2px;
    --spacing-small: 8px;
    --spacing-tiny: 4px;
    --text-shadow:
      -0.0625em -0.0625em 0px rgb(var(--color-background)),
       0.0625em -0.0625em 0px rgb(var(--color-background)),
      -0.0625em 0.0625em 0px rgb(var(--color-background)),
       0.0625em 0.0625em 0px rgb(var(--color-background));
    --transition-custom-color: 200ms;

    &[data-browser="chrome"] {
      --focus-outline-radius: 2px;
      --focus-outline-width: 2px;
    }

    &[data-browser="safari"] {
      --focus-outline-radius: 2px;
      --focus-outline-width: 4px;
    }

    @media screen and (prefers-color-scheme: dark) {
      --box-shadow: 4px 4px 5px rgba(0, 0, 0, 10%);
      --box-shadow-code: inset 1px 1px 2px rgba(0, 0, 0, 10%);
      --color-black: 34, 34, 34;
      --color-border: rgba(var(--color-foreground), 0.3);
      --color-background-code: #1c1b1b;
      --color-code: #ffffff;
      --color-foreground: var(--color-white);
      --color-red: #ff3636;
      --color-blue: #5353ff;
      --color-background: var(--color-black);
      --color-link-visited: #949494;
    }
  }
</style>

<script>
  import endpoints from "library/endpoints";

  // Hoefler's "Production" mode works using a stylesheet `<link>` whose
  // `href` is a typrography.com endpoint. That endpoint returns a
  // stylesheet with a bunch of `@font-face` rules. The rule URLs point
  // our domain because Hoefler gives us a dump of all the fonts we need.
  // So the purpose of their stylesheet to simply to track use.

  // That's fine. But Hoefler doesn't support `crossorigin="anonymous"`. So
  // every stylesheet request is also a cookied-one and thus an opportunity
  // to track more than the use of their fonts. Nor do they support the
  // `integrity` attribute.

  // Using the their stylesheet also adds latency to page load. Maybe there's
  // a way to configure the `font-display` of their stylesheet. But I'd rather
  // not mess with `font-display`. Personally, I prefer to wait than have the
  // page shifting around under me.

  // In our case, at least, `font-display` would be a hack around overuse of
  // custom fonts or a poorly designed initial load. But relative to other
  // resources on the page, the size of our custom fonts is crazy. If initial
  // load times go downhill, we might inline the custom fonts (and everything
  // else) and then subsequently add them to cache using the worker.

  // Anyway, Hoefler needs to track our use of their fonts. So we call this
  // endpoint, which in turn requests the Hoefler stylesheet and does nothing
  // with it. If the endpoint throws, then the Hoefler stylesheet request was
  // forbidden (perhaps we've blown our quota) and we need to not use their
  // fonts.

  if (process.env.NODE_ENV !== "development") {
    endpoints
      .hoefler()
      .catch(() => {
        document.documentElement.style.setProperty("--font-serif", "sans-serif");
        document.documentElement.style.setProperty("--font-monospace", "monospace");
        document.documentElement.style.setProperty("--font-sans-serif", "serif");
      });
  }
</script>
