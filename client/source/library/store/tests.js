import test from "ava";
import { writable } from "./index";

test("subscriber is called immediately", t => {
  const store = writable(null);
  let isCalled;

  store.subscribe(() => {
    isCalled = true;
  });

  t.true(isCalled);
});

test("subscriber is not called after unsubscribing", t => {
  const store = writable(null);
  let called = 0;

  const unsubscribe = store.subscribe(() => {
    called += 1;
  });

  unsubscribe();
  store.set(null);
  t.is(called, 1);
});

test("subscriber is called with current store", t => {
  const store = writable(1);
  let called = 0;

  t.plan(2);

  store.subscribe(current => {
    called += 1;

    if (called === 1) {
      t.is(current, 1);
    } else if (called === 2) {
      t.is(current, 2);
    }
  });

  store.set(2);
});
