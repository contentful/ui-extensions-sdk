export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
}

export function createDeferred<T = unknown>(): Deferred<T> {
  let outerResolve: Deferred<T>['resolve']
  const promise = new Promise<T>((resolve) => {
    outerResolve = resolve
  })

  return {
    promise,

    // @ts-expect-error The callback passed into new Promise is immediately called
    resolve: outerResolve,
  }
}
