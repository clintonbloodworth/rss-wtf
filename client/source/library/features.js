const isScrollBehavior = "scrollBehavior" in document.documentElement.style
  ? true
  : import("smoothscroll-polyfill")
    .then(module => {
      module.polyfill();
      return true;
    })
    .catch(() => false);

export {
  isScrollBehavior,
};
