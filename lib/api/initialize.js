import connect from './channel'

export default function createInitializer (apiCreator) {
  const apiDeferred = createDeferred()
  const channelDeferred = createDeferred()
  channelDeferred.then(addFocusHandlers)

  connect(window.parent, (channel, params, messageQueue) => {
    channelDeferred.resolve(channel)
    const api = apiCreator(channel, params)
    messageQueue.forEach((m) => {
      channel._handleMessage(m)
    })
    apiDeferred.resolve(api)
  })

  return function init (initCb) {
    apiDeferred.then(initCb)
  }
}

function addFocusHandlers (channel) {
  document.addEventListener('focus', () => channel.send('setActive', true), true)
  document.addEventListener('blur', () => channel.send('setActive', false), true)
}

function createDeferred () {
  let isResolved = false
  let resolvedValue
  let callbacks = []
  return {
    resolve: function (value) {
      isResolved = true
      resolvedValue = value
      callbacks.forEach((cb) => cb(value))
    },
    then: function (cb) {
      if (isResolved) {
        cb(resolvedValue)
      } else {
        callbacks.push(cb)
      }
    }
  }
}
