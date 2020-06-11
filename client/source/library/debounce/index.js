export default (callback, wait) => {
  let timeout;

  return arguments$ => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(arguments$);
    }, wait);
  };
};
