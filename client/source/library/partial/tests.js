import test from "ava";
import sinon from "sinon";
import partial from "./index";

test("returns a function", t => {
  const function$ = partial(() => {});
  t.is(typeof function$, "function");
});

test("function is not called immediately", t => {
  const spy = sinon.spy();
  partial(spy);
  t.false(spy.called);
});

test("function is called with correct arguments", t => {
  const spy = sinon.spy();
  const partially = partial(spy, 1, 2);
  partially(3);
  partially(3);
  t.true(spy.alwaysCalledWithExactly(1, 2, 3));
  partially();
  t.is(spy.lastCall.args.length, 2);
});

test("throws if called without function", t => {
  t.throws(() => {
    partial();
  });
});
