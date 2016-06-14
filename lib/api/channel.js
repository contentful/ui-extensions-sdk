import Promise from 'yaku'
import { Signal } from './signal'

export default class Channel {

  constructor (sourceId, targetWindow) {
    this.sourceId = sourceId
    this.targetWindow = targetWindow // contentful webapp window
    this._messageCount = 0
    this._messageHandlers = {}
    this._responseHandlers = {}

    // window refers to iframe contentWindow
    window.addEventListener('message', (event) => {
      this._handleMessage(event.data)
    })
  }

  // call method with name `method` exposed by contentful web app `window`
  call (method, ...params) {
    const messageId = this._send(method, params)
    return new Promise((resolve, reject) => {
      this._responseHandlers[messageId] = {resolve, reject}
    })
  }

  send (method, ...params) {
    this._send(method, params)
  }

  addHandler (method, handler) {
    if (!(method in this._messageHandlers)) {
      this._messageHandlers[method] = new Signal()
    }
    return this._messageHandlers[method].attach(handler)
  }

  _handleMessage (message) {
    if (message.method) {
      const {method, params} = message
      const handlers = this._messageHandlers[method]
      if (handlers) {
        handlers.dispatch(...params)
      }
    } else {
      const {id, result, error} = message
      const responseHandler = this._responseHandlers[id]
      if (!responseHandler) {
        return
      }
      if (result) {
        responseHandler.resolve(result)
      } else if (error) {
        responseHandler.reject(error)
      }
      delete this._responseHandlers[id]
    }
  }

  _send (method, params) {
    const messageId = this._messageCount++

    this.targetWindow.postMessage({
      source: this.sourceId,
      id: messageId,
      method,
      params
    }, '*')

    return messageId
  }

}
