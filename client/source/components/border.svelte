<div
  class="border"
  class:animate={isAnimate}
  use:setRadius>

  <slot></slot>

  <svg
    class:error={isError}
    class:animate={isAnimate}
    width="400"
    height="400">

    <rect 
      x="0"
      y="0"
      width="100%" 
      height="100%" 
      rx="{radius}">
  </rect>
  </svg>
</div>

<style>
  .border {
    --border-radius-: var(--border-radius, var(--border-radius-small));

    height: 100%;
    position: relative;

    &::after {
      border: var(--border);
      border-radius: var(--border-radius-);
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    &.animate {
      &::after {
        border-color: transparent;
      }
    }
  }

  svg {
    animation-direction: reverse;
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    fill: transparent;
    pointer-events: none;
    position: absolute;
    stroke: var(--color-blue);
    top: 0;
    left: 0;
    visibility: hidden;
    stroke-dasharray: 4px;
    stroke-width: 2px;
    width: 100%;
    height: 100%;
    pointer-events: none;

    @keyframes animation {
      0% {
        stroke-dashoffset: 0;
      }

      100% {
        stroke-dashoffset: 100;
      }
    }

    &.animate {
      animation-name: animation;
      visibility: visible;
    }

    &.error {
      stroke: var(--color-red);
    }
  }
</style>

<script>
  let isAnimate = false;
  let isError = false;
  let radius;

  function setRadius(border) {
    const styles = window.getComputedStyle(border);
    radius = parseInt(styles.getPropertyValue("--border-radius-"), 10);
  }

  export {
    isAnimate,
    isError,
  };
</script>
