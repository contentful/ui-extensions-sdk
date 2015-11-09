import Promise from 'yaku'

export default class Channeld {

  constructor (sourceId) {
    this.sourceId = sourceId
    this.messageID = 0
    this.messageHandlers = {}
    this.responseHandlers = {}

    window.addEventListener('message', (event) => {
      this._handleMessage(event.data)
    })
  }

  call (method, ...params) {
    var messageID = this._send(method, params)
    return new Promise((resolve, reject) => {
      this.responseHandlers[messageID] = {resolve, reject}
    })
  }

  send (method, ...params) {
    this._send(method, params)
  }

  addHandler (method, handler) {
    if (!(method in this.messageHandlers)) {
      this.messageHandlers[method] = []
    }
    this.messageHandlers[method].push(handler)
  }

  _handleMessage (message) {
    if (message.method) {
      // console.log('received message', message)
      let {method, params} = message
      let handlers = this.messageHandlers[method] || []
      handlers.forEach((handler) => {
        handler(...params)
      })
    } else {
      let {id, result, error} = message
      let handler = this.responseHandlers[id]

      if (!handler) {
        return
      }

      if (result) {
        handler.resolve(result)
      } else if (error) {
        handler.reject(error)
      }

      delete this.responseHandlers[id]
    }
  }

  _send (method, params) {
    var messageID = this.messageID++

    window.parent.postMessage({
      source: this.sourceId,
      id: messageID,
      method,
      params
    }, '*')

    return messageID
  }

}
