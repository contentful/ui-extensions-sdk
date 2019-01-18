const { Promise } = require('es6-promise')

const { Signal } = require('./signal')

module.exports = function connect (currentWindow, onConnect) {
  waitForConnect(currentWindow, (params, messageQueue) => {
    const channel = new Channel(params.id, currentWindow)
    onConnect(channel, params, messageQueue)
  })
}

function waitForConnect (currentWindow, onConnect) {
  currentWindow.addEventListener('message', listener)

  function listener (event) {
    const message = event.data
    if (message.method === 'connect') {
      currentWindow.removeEventListener('message', listener)
      onConnect(...message.params)
    }
  }
}

class Channel {
  constructor (sourceId, currentWindow) {
    this._messageHandlers = {}
    this._responseHandlers = {}

    this._send = createSender(sourceId, currentWindow.parent)

    currentWindow.addEventListener('message', (event) => {
      this._handleMessage(event.data)
    })
  }

  // call method with name `method` exposed by contentful web app `window`
  call (method, ...params) {
    const messageId = this._send(method, params)
    return new Promise((resolve, reject) => {
      this._responseHandlers[messageId] = { resolve, reject }
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
      const { method, params } = message
      const handlers = this._messageHandlers[method]
      if (handlers) {
        handlers.dispatch(...params)
      }
    } else {
      const { id } = message
      const responseHandler = this._responseHandlers[id]
      if (!responseHandler) {
        return
      }
      if ('result' in message) {
        responseHandler.resolve(message.result)
      } else if ('error' in message) {
        // TODO We should wrap this in an Error instance
        responseHandler.reject(message.error)
      }
      delete this._responseHandlers[id]
    }
  }
}

function createSender (sourceId, targetWindow) {
  let messageCount = 0
  return function send (method, params) {
    const messageId = messageCount++

    targetWindow.postMessage({
      source: sourceId,
      id: messageId,
      method,
      params
    }, '*')

    return messageId
  }
}
