const HOOK_STAGE_PRE_INSTALL = 'preInstall'
const HOOK_STAGE_POST_INSTALL = 'postInstall'

const isObject = o => typeof o === 'object' && o !== null && !Array.isArray(o)
const isFunction = f => typeof f === 'function'
const isPromise = p => isObject(p) && isFunction(p.then)

const runHandler = handler => {
  // Handler was not registered. Registering a handler is not
  // required and we resolve with empty parameters in this case.
  if (!isFunction(handler)) {
    return Promise.resolve({})
  }

  // If handler is synchronous it can throw and we need to
  // catch it. We resolve with `false` in this case.
  let maybeResultPromise
  try {
    maybeResultPromise = handler()
  } catch (err) {
    return Promise.resolve(false)
  }

  // If handler is synchronous, we wrap the result with a promise
  // and deal only with Promises API below.
  let resultPromise = maybeResultPromise
  if (!isPromise(resultPromise)) {
    resultPromise = Promise.resolve(resultPromise)
  }

  return resultPromise
    .then(
      result => {
        if (result instanceof Error || result === false) {
          return false
        } else if (!isObject(result)) {
          return {}
        } else {
          return result
        }
      },
      () => false
    )
    .catch(() => false)
}

module.exports = function createApp(channel) {
  const handlers = {
    [HOOK_STAGE_PRE_INSTALL]: null,
    [HOOK_STAGE_POST_INSTALL]: null
  }

  const setHandler = (stage, handler) => {
    if (handlers[stage]) {
      throw new Error('Cannot register a handler twice.')
    } else if (!isFunction(handler)) {
      throw new Error('Handler must be a function.')
    } else {
      handlers[stage] = handler
    }
  }

  channel.addHandler('appHook', ({ stage, installationRequestId }) => {
    return runHandler(handlers[stage]).then(result => {
      channel.send('appHookResult', { stage, installationRequestId, result })
    })
  })

  return {
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
      setHandler(HOOK_STAGE_PRE_INSTALL, handler)
    },
    setReady() {
      return channel.call('callAppMethod', 'setReady')
    }
  }
}
