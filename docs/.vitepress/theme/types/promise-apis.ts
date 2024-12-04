export const promiseApiTypes = `
interface Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected).
   * The resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled.
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

interface PromiseConstructor {
  /**
   * Creates a new Promise.
   * @param executor A callback used to initialize the promise. This callback is passed two arguments:
   * a resolve callback used to resolve the promise with a value or the result of another promise,
   * and a reject callback used to reject the promise with a provided reason or error.
   */
  new <T>(executor: (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
  ) => void): Promise<T>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  all<T extends readonly unknown[] | []>(
    values: T
  ): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;

  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  race<T extends readonly unknown[] | []>(
    values: T
  ): Promise<Awaited<T[number]>>;

  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve or reject.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  allSettled<T extends readonly unknown[] | []>(
    values: T
  ): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve or reject.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  allSettled<T>(
    values: Iterable<T | PromiseLike<T>>
  ): Promise<PromiseSettledResult<Awaited<T>>[]>;

  /**
   * Creates a Promise that is resolved with the value of the first provided Promise that resolves,
   * or rejected with an AggregateError if all Promises are rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  any<T extends readonly unknown[] | []>(
    values: T
  ): Promise<Awaited<T[number]>>;

  /**
   * Creates a Promise that is resolved with the value of the first provided Promise that resolves,
   * or rejected with an AggregateError if all Promises are rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;

  /**
   * Creates a new rejected promise for the provided reason.
   * @param reason The reason the promise was rejected.
   * @returns A new rejected Promise.
   */
  reject<T = never>(reason?: any): Promise<T>;

  /**
   * Creates a new resolved promise.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;

  /**
   * Creates a new resolved promise for the provided value.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve(): Promise<void>;
}

interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

interface AggregateError extends Error {
  errors: any[];
}

declare var Promise: PromiseConstructor;

// Additional Promise utility types
type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: any[]): any } ?
    F extends ((value: infer V, ...args: any[]) => any) ?
      Awaited<V> :
      never :
    T;

type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

type UnwrapPromise<T> =
  T extends Promise<infer U> ? UnwrapPromise<U> :
  T extends (...args: any[]) => Promise<infer U> ? U :
  T extends (...args: any[]) => infer U ? U :
  T;

type PromiseAll<T extends any[]> = Promise<{ [P in keyof T]: Awaited<T[P]> }>;

type PromiseRace<T extends any[]> = Promise<Awaited<T[number]>>;

type PromiseAllSettled<T extends any[]> = Promise<{
  [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
}>;

type PromiseAny<T extends any[]> = Promise<Awaited<T[number]>>;
`;
