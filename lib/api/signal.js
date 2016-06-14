require('core-js/es6/symbol')

export class Signal {
  constructor () {
    this._id = 0
    this._listeners = {}
  }

  dispatch (...args) {
    for (let key in this._listeners) {
      this._listeners[key](...args)
    }
  }

  attach (listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener function expected')
    }
    const id = this._id++
    this._listeners[id] = listener
    // return function that'll detach the listener
    return () => delete this._listeners[id]
  }
}

const memArgsSymbol = Symbol('Private memoized arguments')

export class MemoizedSignal extends Signal {
  constructor (...memoizedArgs) {
    if (!memoizedArgs.length) {
      throw new Error('Initial value to be memoized expected')
    }
    super()
    this[memArgsSymbol] = memoizedArgs
  }

  dispatch (...args) {
    this[memArgsSymbol] = args
    super.dispatch(...args)
  }

  attach (listener) {
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
