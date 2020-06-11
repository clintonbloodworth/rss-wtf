const isChrome = navigator.userAgent.includes("Chrome");
const isFirefox = navigator.userAgent.includes("Firefox");
const isSafari = navigator.userAgent.includes("Safari")
  && navigator.vendor.startsWith("Apple");

const browser = isChrome
  ? "chrome"
  : isFirefox
    ? "firefox"
    : isSafari
      ? "safari"
      : "";

export {
  browser,
  isChrome,
  isFirefox,
  isSafari,
};
