import connect from './channel'
import { Promise } from 'es6-promise'

export default function createInitializer (apiCreator) {
  const apiDeferred = createDeferred()
  const channelDeferred = createDeferred()
  channelDeferred.promise.then(addFocusHandlers)

  connect(window.parent, (channel, params, messageQueue) => {
    channelDeferred.resolve(channel)
    const api = apiCreator(channel, params)
    messageQueue.forEach((m) => {
      channel._handleMessage(m)
    })
    apiDeferred.resolve(api)
  })

  return function init (initCb) {
    apiDeferred.promise.then(initCb)
  }
}

function addFocusHandlers (channel) {
  document.addEventListener('focus', () => channel.send('setActive', true), true)
  document.addEventListener('blur', () => channel.send('setActive', false), true)
}

function createDeferred () {
  const deferred = {}
  deferred.promise = new Promise(resolve => {
    deferred.resolve = resolve
  })

  return deferred
}
