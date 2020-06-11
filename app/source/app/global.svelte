<style>
  @import "library/functions";

  $typeface-heading: "Ideal Sans A", "Ideal Sans B", sans-serif;

  :global(*) {
    color: var(--color-text);
  }

  :global(html) {
    --border-radius: 2px;
    --border-style: solid;
    --border-width: 1px;
    --border: var(--border-width) var(--border-style) var(--color-border);
    --color-black: #000000;
    --color-dark: #191919;
    --color-light: #f7f7f7;
    --font-family-body: "Sentinel A", "Sentinel B", serif;
    --font-family-code: "Operator Mono A", "Operator Mono B", monospace;
    --font-family-heading: #{$typeface-heading};
    --height: #{rem(30px)};
  }

  :global(body) {
    background-color: var(--color-background);
    -webkit-font-smoothing: antialiased;
    height: 100%;
    overflow: hidden; // Prevent overscroll bounce (Mobile Safari).
    position: fixed; // Disable double-tap zoom and overscroll (Mobile Safari).
  }

  :global(a) {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :global(noscript) {
    align-items: center;
    background-color: black;
    color: #ffffff;
    display: flex;
    height: 100vh;
    justify-content: center;
    width: 100vw;
  }

  :global(noscript h1) {
    font-family: $typeface-heading;
    font-size: 3.5rem;
    margin-bottom: 10vh;
    width: min-content;
  }

  :global([theme="light"]) {
    --color-accent: #5d40ff;
    --color-active: #7268ff;
    --color-background: #ffffff;
    --color-border: #dcdcdc;
    --color-code-background: #f3ebeb;
    --color-destructive: #ff3d3d;
    --color-foreground: #ffffff;
    --color-link-visited: #660099;
    --color-link: #1558d6;
    --color-selection-background: #ffffff;
    --color-selection: #0000ff;
    --color-text: #3e3e3e;
  }

  :global([theme="dark"]) {
    --color-accent: #d8d8d8;
    --color-active: #e09109;
    --color-background: #0e0e0e;
    --color-border-foreground: #1d1d1d;
    --color-border: #1e1e1e;
    --color-code-background: #171616;
    --color-destructive: #ff3d3d;
    --color-foreground: #101010;
    --color-link-visited: #660099;
    --color-link: #1558d6;
    --color-error: #9e0000;
    --color-selection-background: #ffffff;
    --color-selection: #0000ff;
    --color-text: #d8d8d8;
  }
</style>

<script context="module">
  (window.visualViewport || window).addEventListener('resize', onViewportResize);

  const vh = (window.visualViewport && window.visualViewport.height || window.innerHeight) * 0.01;
  window.document.documentElement.style.setProperty('--vh', `${vh}px`);

  const isMac = navigator.platform.startsWith('Mac');
  const isWindows = navigator.platform === 'Win32';

  if (isMac) {
    window.document.documentElement.style.setProperty('--scrollbar-width', '8px');
  } else if (isWindows) {
    // TODO
    window.document.documentElement.style.setProperty('--scrollbar-width', '15px');
  } else {
    // TODO
    window.document.documentElement.style.setProperty('--scrollbar-width', '15px');
  }

  function onViewportResize() {
    const vh = (window.visualViewport && window.visualViewport.height || window.innerHeight) * 0.01;
    window.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
</script>
