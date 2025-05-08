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
    /**
     * Callback function to execute before a job was executed.
     * @type {undefined | Hook}
     */
    onJobExecuted: undefined | Hook;
    /**
     * Callback function to execute when a job resolved.
     * @type {undefined | Hook}
     */
    onJobResolved: undefined | Hook;
    /**
     * Callback function to execute when a job rejected.
     * @type {undefined | Hook}
     */
    onJobRejected: undefined | Hook;
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
    add<R>(func: () => Promise<R>): Promise<R>;
    #private;
}
export type Job = {
    /**
     * the incremented ID of the job
     */
    id: number;
    /**
     * the function of the job
     */
    func: () => Promise<void>;
};
export type Hook = (job: Job) => Promise<void>;
