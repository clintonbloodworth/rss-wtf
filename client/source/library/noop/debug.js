const debug = () => {
  const debug = () => {};
  debug.extend = () => {
    return () => {};
  };

  return debug;
};

debug.disable = () => {};
debug.enable = () => {};

export default debug;
