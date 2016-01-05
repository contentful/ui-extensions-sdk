export default class Signal {
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
    var id = this._id++
    this._listeners[id] = listener
    var self = this
    return function removeListener () {
      delete self._listeners[id]
    }
  }
}
