import { AppHookStages } from './types'

const isObject = o => typeof o === 'object' && o !== null && !Array.isArray(o)
const isFunction = f => typeof f === 'function'
const isPromise = p => isObject(p) && isFunction(p.then)

const handleHandlerError = err => {
  console.error(err)
  return Promise.resolve(false)
}

const runHandler = (handler, defaultResult, handlerArg?) => {
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
    .then(result => {
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

export default function createApp(channel) {
  const handlers = {
    [AppHookStages.PreInstall]: null,
    [AppHookStages.PostInstall]: null
  }

  const setHandler = (stage, handler) => {
    if (!isFunction(handler)) {
      throw new Error('Handler must be a function.')
    } else {
      handlers[stage] = handler
    }
  }

  channel.addHandler('appHook', ({ stage, installationRequestId, err }) => {
    if (stage === AppHookStages.PreInstall) {
      return runHandler(handlers[stage], {}).then(result => {
        return channel.send('appHookResult', { stage, installationRequestId, result })
      })
    } else if (stage === AppHookStages.PostInstall) {
      return runHandler(handlers[stage], undefined, err || null).then(() => {
        return channel.send('appHookResult', { stage, installationRequestId })
      })
    } else {
      return Promise.resolve()
    }
  })

  return {
    setReady() {
      return channel.call('callAppMethod', 'setReady')
    },
    isInstalled() {
      return channel.call('callAppMethod', 'isInstalled')
    },
    getParameters() {
      return channel.call('callAppMethod', 'getParameters')
    },
    getCurrentState() {
      return channel.call('callAppMethod', 'getCurrentState')
    },
    onConfigure(handler) {
      setHandler(AppHookStages.PreInstall, handler)
    },
    onConfigurationCompleted(handler) {
      setHandler(AppHookStages.PostInstall, handler)
    }
  }
}
