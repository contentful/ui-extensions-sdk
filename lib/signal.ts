type Listener<T extends unknown[]> = (...args: T) => void

export class Signal<T extends unknown[]> {
  private _id = 0
  private _listeners: { [key: string]: Listener<T> } = {}

  dispatch(...args: T) {
    for (const key in this._listeners) {
      this._listeners[key](...args)
    }
  }

  attach(listener: Listener<T>) {
    if (typeof listener !== 'function') {
      throw new Error('listener function expected')
    }
    const id = this._id++
    this._listeners[id] = listener
    // return function that'll detach the listener
    return () => delete this._listeners[id]
  }
}

export class MemoizedSignal<T extends unknown[]> extends Signal<T> {
  private _memoizedArgs: T

  constructor(...memoizedArgs: T) {
    super()

    if (!memoizedArgs.length) {
      throw new Error('Initial value to be memoized expected')
    }

    this._memoizedArgs = memoizedArgs
  }

  dispatch(...args: T) {
    this._memoizedArgs = args
    super.dispatch(...args)
  }

  attach(listener: Listener<T>) {
    /*
     * attaching first so that we throw a sensible
     * error if listener is not a function without
     * duplication of is function check
     */
    const detachListener = super.attach(listener)

    listener(...this._memoizedArgs)
    return detachListener
  }

  getMemoizedArgs(): T {
    return this._memoizedArgs
  }
}
