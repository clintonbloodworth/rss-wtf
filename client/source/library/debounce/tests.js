import ava from "ava";
import debounce from "./index";

ava.cb("function is not called too soon", test => {
  const delay = 100;
  let isError = true;

  const debounced = debounce(() => {
    test.end(isError);
  }, delay);

  setTimeout(() => {
    isError = false;
  }, delay - 50);

  debounced();
});

ava.cb("function is called once", test => {
  const delay = 100;
  let called = 0;

  const debounced = debounce(() => {
    called += 1;
    test.end(called > 1);
  }, delay);

  debounced();
  setTimeout(debounced, 50);
  setTimeout(debounced, 50);
});

ava.cb("function is not called too late", test => {
  const delay = 100;
  let isError = false;

  const debounced = debounce(() => {
    test.end(isError);
  }, delay);

  setTimeout(() => {
    isError = true;
  }, delay + 50);

  debounced();
});
