const { Promise } = require('es6-promise')

const connect = require('./channel')

module.exports = function createInitializer(currentWindow, apiCreator) {
  const connectDeferred = createDeferred()

  connectDeferred.promise.then(([channel]) => {
    const { document } = currentWindow
    document.addEventListener('focus', () => channel.send('setActive', true), true)
    document.addEventListener('blur', () => channel.send('setActive', false), true)
  })

  // We need to connect right away so we can record incoming
  // messages before `init` is called.
  connect(
    currentWindow,
    (...args) => connectDeferred.resolve(args)
  )

  return function init(initCb, { makeCustomApi } = {}) {
    connectDeferred.promise.then(([channel, params, messageQueue]) => {
      const api = apiCreator(channel, params, currentWindow)

      let customApi
      if (typeof makeCustomApi === 'function') {
        customApi = makeCustomApi(channel, params)
      }

      // Handle pending incoming messages.
      // APIs are created before so handlers are already
      // registered on the channel.
      messageQueue.forEach(m => {
        channel._handleMessage(m)
      })

      // Hand over control to the developer.
      initCb(api, customApi)
    })
  }
}

function createDeferred() {
  const deferred = {}
  deferred.promise = new Promise(resolve => {
    deferred.resolve = resolve
  })

  return deferred
}
