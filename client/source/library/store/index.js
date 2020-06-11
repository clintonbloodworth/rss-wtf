import create from "./create";

function writable(value, options) {
  return create(value, options);
}

function readable(value, options) {
  const store = create(value, options);

  return {
    ready: store.ready,
    subscribe: store.subscribe,
  };
}

export {
  readable,
  writable,
};
