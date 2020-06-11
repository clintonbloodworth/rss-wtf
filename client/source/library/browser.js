const isChrome = navigator.userAgent.includes("Chrome");
const isFirefox = navigator.userAgent.includes("Firefox");
const isSafari = navigator.userAgent.includes("Safari")
  && navigator.vendor.startsWith("Apple");

export {
  isChrome,
  isFirefox,
  isSafari,
};
