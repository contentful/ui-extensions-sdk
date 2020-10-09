class Signal {
  private _id = 0
  private _listeners: { [key: string]: Function } = {}

  dispatch(...args: any[]) {
    for (const key in this._listeners) {
      this._listeners[key](...args)
    }
  }

  attach(listener: Function) {
    if (typeof listener !== 'function') {
      throw new Error('listener function expected')
    }
    const id = this._id++
    this._listeners[id] = listener
    // return function that'll detach the listener
    return () => delete this._listeners[id]
  }
}

const memArgsSymbol = '__private__memoized__arguments__'

class MemoizedSignal extends Signal {
  private [memArgsSymbol]: any[] = []

  constructor(...memoizedArgs: any[]) {
    super()

    if (!memoizedArgs.length) {
      throw new Error('Initial value to be memoized expected')
    }

    this[memArgsSymbol] = memoizedArgs
  }

  dispatch(...args: any[]) {
    this[memArgsSymbol] = args
    super.dispatch(...args)
  }

  attach(listener: Function) {
    /*
     * attaching first so that we throw a sensible
     * error if listener is not a function without
     * duplication of is function check
     */
    const detachListener = super.attach(listener)

    listener(...this[memArgsSymbol])
    return detachListener
  }
}

export { Signal, MemoizedSignal }
