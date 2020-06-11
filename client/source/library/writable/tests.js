import ava from "ava";
import writable from "./index";

ava("subscriber is called immediately", test => {
  const store = writable(null);
  let isCalled;

  store.subscribe(() => {
    isCalled = true;
  });

  test.true(isCalled);
});

ava("subscriber is not called after unsubscribing", test => {
  const store = writable(null);
  let called = 0;

  const unsubscribe = store.subscribe(() => {
    called += 1;
  });

  unsubscribe();
  store.set(null);
  test.is(called, 1);
});

ava("subscriber is called with current store", test => {
  const store = writable(1);
  let called = 0;

  test.plan(2);

  store.subscribe(current => {
    called += 1;

    if (called === 1) {
      test.is(current, 1);
    } else if (called === 2) {
      test.is(current, 2);
    }
  });

  store.set(2);
});
