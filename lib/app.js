const HOOK_STAGE_PRE_INSTALL = 'preInstall'
const HOOK_STAGE_POST_INSTALL = 'postInstall'

const isObject = o => typeof o === 'object' && o !== null && !Array.isArray(o)

const runHandler = handler => {
  handler = typeof handler === 'function' ? handler : () => {}

  let resultMaybePromise
  try {
    resultMaybePromise = handler()
  } catch (err) {
    resultMaybePromise = false
  }

  const isPromise = resultMaybePromise && typeof resultMaybePromise.then === 'function'
  const resultPromise = isPromise ? resultMaybePromise : Promise.resolve(resultMaybePromise)

  return resultPromise.then(
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
}

module.exports = function createApp(channel) {
  const handlers = {
    [HOOK_STAGE_PRE_INSTALL]: null,
    [HOOK_STAGE_POST_INSTALL]: null
  }

  const setHandler = (stage, handler) => {
    if (handlers[stage]) {
      throw new Error('Cannot register a handler twice.')
    } else if (typeof handler !== 'function') {
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
    onConfigure(handler) {
      setHandler(HOOK_STAGE_PRE_INSTALL, handler)
    },
    onConfigurationCompleted(handler) {
      setHandler(HOOK_STAGE_POST_INSTALL, handler)
    }
  }
}
