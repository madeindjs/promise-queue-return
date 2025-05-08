import { describe, test, mock } from "node:test";
import assert from "node:assert/strict";
import { PromiseQueue } from "./index.js";

function flushPromises() {
  return new Promise((res) => setTimeout(res, 0));
}

describe(PromiseQueue.name, () => {
  test("should handle sequential functions", async () => {
    let counter = 0;
    async function func() {
      counter++;
      return counter;
    }

    const queue = new PromiseQueue();

    assert.strictEqual(await queue.add(func), 1);
    assert.strictEqual(await queue.add(func), 2);
    assert.strictEqual(await queue.add(func), 3);
  });

  test("should handle error functions", async () => {
    const queue = new PromiseQueue();
    const onJobRejected = mock.fn();
    queue.onJobRejected = async () => {
      onJobRejected();
    };

    async function throws() {
      throw Error();
    }

    await queue.add(throws).catch(() => {});
    await queue.add(throws).catch(() => {});
    await flushPromises();
    assert.strictEqual(onJobRejected.mock.callCount(), 2);
  });

  test("should execute hook", async () => {
    let counter = 0;
    async function func() {
      counter++;
      return counter;
    }

    const queue = new PromiseQueue();
    const onJobExecuted = mock.fn();
    queue.onJobExecuted = async () => {
      onJobExecuted();
    };

    assert.strictEqual(await queue.add(func), 1);
    await flushPromises();
    assert.strictEqual(onJobExecuted.mock.callCount(), 1);
  });
});
