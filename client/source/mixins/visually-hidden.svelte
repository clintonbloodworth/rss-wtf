<div class="visually-hidden">
  <slot></slot>
</div>

<style>
  /*
    TODO: Update this and the other mixins to use `:where()`
    once it's enabled in Chromium:
    https://bugs.chromium.org/p/chromium/issues/detail?id=568705#c56
  */

  .visually-hidden {
    display: contents;

    & > :global(*) {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  }
</style>
