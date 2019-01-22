const { Promise } = require('es6-promise')

const connect = require('./channel')

module.exports = function createInitializer (currentWindow, apiCreator) {
  const apiDeferred = createDeferred()
  const channelDeferred = createDeferred()

  channelDeferred.promise.then(channel => {
    const { document } = currentWindow
    document.addEventListener('focus', () => channel.send('setActive', true), true)
    document.addEventListener('blur', () => channel.send('setActive', false), true)
  })

  connect(currentWindow, (channel, params, messageQueue) => {
    channelDeferred.resolve(channel)
    const api = apiCreator(channel, params, currentWindow)
    messageQueue.forEach((m) => {
      channel._handleMessage(m)
    })
    apiDeferred.resolve(api)
  })

  return function init (initCb) {
    apiDeferred.promise.then(initCb)
  }
}

function createDeferred () {
  const deferred = {}
  deferred.promise = new Promise(resolve => {
    deferred.resolve = resolve
  })

  return deferred
}
