export default (function$, ...arguments$) => {
  if (!function$) {
    const error = new Error("function");
    error.name = "MissingArgument";
    throw error;
  }

  return (...arguments$$) => {
    function$(...arguments$, ...arguments$$);
  };
};
