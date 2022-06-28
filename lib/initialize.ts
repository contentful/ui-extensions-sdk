import { ConnectMessage, KnownSDK } from './types'
import connect, { Channel } from './channel'

export default function createInitializer(
  currentGlobal: typeof globalThis,
  apiCreator: (channel: Channel, data: ConnectMessage, currentGlobal: typeof globalThis) => KnownSDK
) {
  if (
    typeof currentGlobal.window === 'undefined' ||
    typeof currentGlobal.document === 'undefined'
  ) {
    // make `init` a noop if window or document is not available
    return () => {}
  }

  const connectDeferred =
    createDeferred<[channel: Channel, message: ConnectMessage, messageQueue: unknown[]]>()

  connectDeferred.promise.then(([channel]) => {
    const { document } = currentGlobal
    document.addEventListener('focus', () => channel.send('setActive', true), true)
    document.addEventListener('blur', () => channel.send('setActive', false), true)
  })

  // We need to connect right away so we can record incoming
  // messages before `init` is called.
  connect(currentGlobal, (...args) => connectDeferred.resolve(args))

  let initializedSdks: Promise<[sdk: KnownSDK, customSdk: any]> | undefined
  return function init(
    initCb: (sdk: KnownSDK, customSdk: any) => any,
    {
      makeCustomApi,
      supressIframeWarning,
    }: { makeCustomApi?: Function; supressIframeWarning?: boolean } = {
      supressIframeWarning: false,
    }
  ) {
    if (!supressIframeWarning && currentGlobal.self === currentGlobal.top) {
      console.error(`Cannot use App SDK outside of Contenful:

In order for the App SDK to function correctly, your app needs to be run in an iframe in the Contentful Web App, Compose or Launch.

Learn more about local development with the App SDK here:
  https://www.contentful.com/developers/docs/extensibility/ui-extensions/faq/#how-can-i-develop-with-the-ui-extension-sdk-locally`)
    }

    if (!initializedSdks) {
      initializedSdks = connectDeferred.promise.then(([channel, params, messageQueue]) => {
        const api = apiCreator(channel, params, currentGlobal)

        let customApi
        if (typeof makeCustomApi === 'function') {
          customApi = makeCustomApi(channel, params)
        }

        // Handle pending incoming messages.
        // APIs are created before so handlers are already
        // registered on the channel.
        messageQueue.forEach((m) => {
          // TODO Expose private handleMessage method
          ;(channel as any)._handleMessage(m)
        })

        return [api, customApi]
      })
    }

    initializedSdks.then(([sdk, customSdk]) =>
      // Hand over control to the developer.
      initCb(sdk, customSdk)
    )
  }
}

function createDeferred<T = any>() {
  const deferred: {
    promise: Promise<T>
    resolve: (value: T | PromiseLike<T>) => void
  } = {
    promise: null as any,
    resolve: null as any,
  }

  deferred.promise = new Promise<T>((resolve) => {
    deferred.resolve = resolve
  })

  return deferred
}
