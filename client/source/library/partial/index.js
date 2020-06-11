export default (function$, ...arguments$) => {
  return (...arguments$$) => {
    function$(...arguments$, ...arguments$$);
  };
};
