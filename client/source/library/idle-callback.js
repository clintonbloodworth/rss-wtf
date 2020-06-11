let polyfill;

if (!window.cancelIdleCallback || !window.requestIdleCallback) {
  try {
    polyfill = import("requestidlecallback");
  } catch {}
}

export default {
  async cancel(id) {
    await polyfill;

    if (window.cancelIdleCallback) {
      window.cancelIdleCallback(id);
    }
  },
  async request(callback, options) {
    await polyfill;

    if (window.requestIdleCallback) {
      return window.requestIdleCallback(callback, options);
    }

    return setTimeout(callback);
  },
};
