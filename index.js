/**
 * @typedef Job
 * @property {number} id the incremented ID of the job
 * @property {() => Promise<void>} func the function of the job
 *
 * @typedef {(job: Job) => Promise<void>} Hook
 */

/**
 * A simple promise queue that allow you to push jobs and `await` the result of the promise.
 */
export class PromiseQueue {
  #nextId = 0;
  /** @type {Job[]} */
  #jobs = [];
  #isRunning = false;

  /**
   * Callback function to execute before a job was executed.
   * @type {undefined | Hook}
   */
  onJobExecuted = undefined;
  /**
   * Callback function to execute when a job resolved.
   * @type {undefined | Hook}
   */
  onJobResolved = undefined;
  /**
   * Callback function to execute when a job rejected.
   * @type {undefined | Hook}
   */
  onJobRejected = undefined;

  /**
   * Add a job to the queue
   *
   * @example add a function and wait the result
   * ```js
   * const queue = new PromiseQueue();
   * const user = await queue.add(() => fetchUser());
   * ```
   *
   * @template R
   * @param {() => Promise<R>} func
   * @returns {Promise<R>} a Promise that will be resolved when the job is executed
   */
  add(func) {
    return new Promise(async (res, rej) => {
      async function callback() {
        try {
          const data = await func();
          res(data);
        } catch (e) {
          rej(e);
          throw e;
        }
      }

      const job = { func: callback, id: this.#incrementNextId() };
      this.#jobs.push(job);
      await this.#run();
    });
  }

  async #run() {
    if (this.#isRunning) return;
    this.#isRunning = true;

    while (this.#jobs.length > 0) {
      const job = this.#jobs.shift();
      if (!job) continue;
      try {
        await job.func();
        if (this.onJobResolved) await this.onJobResolved(job);
      } catch {
        if (this.onJobRejected) await this.onJobRejected(job);
      } finally {
        if (this.onJobExecuted) await this.onJobExecuted(job);
      }
    }

    this.#isRunning = false;
  }

  #incrementNextId() {
    return this.#nextId++;
  }
}
