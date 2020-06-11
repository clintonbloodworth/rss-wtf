import test from "ava";
import debounce from "./index";

test.cb("function is not called too soon", t => {
  const delay = 100;
  let isError = true;

  const debounced = debounce(() => {
    t.end(isError);
  }, delay);

  setTimeout(() => {
    isError = false;
  }, delay - 50);

  debounced();
});

test.cb("function is called once", t => {
  const delay = 100;
  let called = 0;

  const debounced = debounce(() => {
    called += 1;
    t.end(called > 1);
  }, delay);

  debounced();
  setTimeout(debounced, 50);
  setTimeout(debounced, 50);
});

test.cb("function is not called too late", t => {
  const delay = 100;
  let isError = false;

  const debounced = debounce(() => {
    t.end(isError);
  }, delay);

  setTimeout(() => {
    isError = true;
  }, delay + 50);

  debounced();
});
