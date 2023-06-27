import { ConnectMessage, KnownAppSDK } from './types'
import { connect, Channel, sendInitMessage } from './channel'
import { createDeferred } from './utils/deferred'

export function createInitializer(
  currentGlobal: typeof globalThis,
  apiCreator: (
    channel: Channel,
    data: ConnectMessage,
    currentGlobal: typeof globalThis
  ) => KnownAppSDK
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

  let initializedSdks: Promise<[sdk: KnownAppSDK, customSdk: any]> | undefined
  return function init(
    initCb: (sdk: KnownAppSDK, customSdk: any) => any,
    {
      makeCustomApi,
      supressIframeWarning,
    }: { makeCustomApi?: Function; supressIframeWarning?: boolean } = {
      supressIframeWarning: false,
    }
  ) {
    if (!supressIframeWarning) {
      warnIfOutsideOfContentful(currentGlobal)
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

      if (!connectDeferred.isFulfilled) {
        sendInitMessage(currentGlobal)
      }
    }

    initializedSdks.then(([sdk, customSdk]) =>
      // Hand over control to the developer.
      initCb(sdk, customSdk)
    )
  }
}

function warnIfOutsideOfContentful(currentGlobal: typeof globalThis) {
  if (currentGlobal.self === currentGlobal.top) {
    console.error(`Cannot use App SDK outside of Contenful:

In order for the App SDK to function correctly, your app needs to be run in an iframe in the Contentful Web App, Compose or Launch.

Learn more about local development with the App SDK here:
https://www.contentful.com/developers/docs/extensibility/ui-extensions/faq/#how-can-i-develop-with-the-ui-extension-sdk-locally`)
  }
}
