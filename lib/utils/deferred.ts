export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  isFulfilled: boolean
}

export function createDeferred<T = unknown>(): Deferred<T> {
  const deferred: Deferred<T> = {
    // @ts-expect-error Immediately set below
    promise: null,

    // @ts-expect-error Promise executor is immdiately executed and sets `resolve`
    resolve: null,

    isFulfilled: false,
  }

  deferred.promise = new Promise<T>((resolve) => {
    deferred.resolve = (...args) => {
      deferred.isFulfilled = true
      resolve(...args)
    }
  })

  return deferred
}
