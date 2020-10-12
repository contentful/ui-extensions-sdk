import { ConnectMessage, KnownSDK } from './types'
import connect, { Channel } from './channel'

export default function createInitializer(
  currentWindow: Window,
  apiCreator: (channel: Channel, data: ConnectMessage, window: Window) => KnownSDK
) {
  const connectDeferred = createDeferred()

  connectDeferred.promise.then(([channel]: [Channel]) => {
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

  return function init(
    initCb: (sdk: KnownSDK, customSdk: any) => any,
    { makeCustomApi = null } = {}
  ) {
    connectDeferred.promise.then(
      ([channel, params, messageQueue]: [Channel, ConnectMessage, unknown[]]) => {
        const api = apiCreator(channel, params, currentWindow)

        let customApi
        if (typeof makeCustomApi === 'function') {
          // Reason for the typecast: https://github.com/microsoft/TypeScript/issues/14889
          customApi = (makeCustomApi as any)(channel, params)
        }

        // Handle pending incoming messages.
        // APIs are created before so handlers are already
        // registered on the channel.
        messageQueue.forEach(m => {
          // TODO Expose private handleMessage method
          ;(channel as any)._handleMessage(m)
        })

        // Hand over control to the developer.
        initCb(api, customApi)
      }
    )
  }
}

function createDeferred<T = any>() {
  const deferred: {
    promise: Promise<T>
    resolve: (value: T | PromiseLike<T>) => void
  } = {
    promise: null as any,
    resolve: null as any
  }

  deferred.promise = new Promise<T>(resolve => {
    deferred.resolve = resolve
  })

  return deferred
}
