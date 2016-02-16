export default function setup (apiCreator) {
  const readyCallbacks = []
  let widgetApi = null

  window.addEventListener('message', initializer)

  return function init (cb) {
    if (widgetApi) {
      cb(widgetApi)
    } else {
      readyCallbacks.push(cb)
    }
  }

  function initializer (event) {
    const method = event.data.method
    const params = event.data.params

    if (method !== 'connect') {
      return
    }

    widgetApi = apiCreator(params)
    window.removeEventListener('message', initializer)

    readyCallbacks.forEach((cb) => cb(widgetApi))
  }
}
