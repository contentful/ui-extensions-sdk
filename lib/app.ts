import { Channel } from './channel'
import { AppConfigAPI, AppState } from './types'
import { OnConfigureHandler } from './types/app.types'
import { KeyValueMap } from './types/entities'

const HOOK_STAGE_PRE_INSTALL = 'preInstall'
const HOOK_STAGE_POST_INSTALL = 'postInstall'

const isObject = (o: any) => typeof o === 'object' && o !== null && !Array.isArray(o)
const isFunction = (f: any) => typeof f === 'function'
const isPromise = (p: any) => isObject(p) && isFunction(p.then)

const handleHandlerError = (err: unknown) => {
  console.error(err)
  return Promise.resolve(false)
}

const runHandler = (handler: Function, defaultResult: any, handlerArg?: any) => {
  // Handler was not registered. Registering a handler is not
  // required. We resolve with the default provided in this case.
  if (!isFunction(handler)) {
    return Promise.resolve(defaultResult)
  }

  // If handler is synchronous it can throw and we need to
  // catch it. We resolve with `false` in this case.
  let maybeResultPromise
  try {
    maybeResultPromise = typeof handlerArg === 'undefined' ? handler() : handler(handlerArg)
  } catch (err) {
    return handleHandlerError(err)
  }

  // If handler is synchronous, we wrap the result with a promise
  // and deal only with Promises API below.
  let resultPromise = maybeResultPromise
  if (!isPromise(resultPromise)) {
    resultPromise = Promise.resolve(resultPromise)
  }

  return resultPromise
    .then((result: any) => {
      if (result instanceof Error) {
        return Promise.reject(result)
      } else if (result === false) {
        return false
      } else if (!isObject(result)) {
        return defaultResult
      } else {
        return result
      }
    }, handleHandlerError)
    .catch(handleHandlerError)
}

export default function createApp(channel: Channel): AppConfigAPI<KeyValueMap> {
  const handlers: { [key: string]: any } = {
    [HOOK_STAGE_PRE_INSTALL]: null,
    [HOOK_STAGE_POST_INSTALL]: null,
  }

  const setHandler = (stage: string, handler: Function) => {
    if (!isFunction(handler)) {
      throw new Error('Handler must be a function.')
    } else {
      handlers[stage] = handler
    }
  }

  channel.addHandler(
    'appHook',
    ({
      stage,
      installationRequestId,
      err,
    }: {
      stage: string
      installationRequestId: string
      err: Error
    }) => {
      if (stage === HOOK_STAGE_PRE_INSTALL) {
        return runHandler(handlers[stage], {}).then((result: any) => {
          return channel.send('appHookResult', { stage, installationRequestId, result })
        })
      } else if (stage === HOOK_STAGE_POST_INSTALL) {
        return runHandler(handlers[stage], undefined, err || null).then(() => {
          return channel.send('appHookResult', { stage, installationRequestId })
        })
      } else {
        return Promise.resolve()
      }
    }
  )

  return {
    setReady() {
      return channel.call('callAppMethod', 'setReady') as Promise<void>
    },
    isInstalled() {
      return channel.call('callAppMethod', 'isInstalled') as Promise<boolean>
    },
    getParameters<T extends KeyValueMap = KeyValueMap>() {
      return channel.call('callAppMethod', 'getParameters') as Promise<T | null>
    },
    getCurrentState() {
      return channel.call('callAppMethod', 'getCurrentState') as Promise<AppState | null>
    },
    onConfigure(handler: OnConfigureHandler<KeyValueMap>) {
      setHandler(HOOK_STAGE_PRE_INSTALL, handler)
    },
    onConfigurationCompleted(handler: (err: null | { message: string }) => void) {
      setHandler(HOOK_STAGE_POST_INSTALL, handler)
    },
  }
}
