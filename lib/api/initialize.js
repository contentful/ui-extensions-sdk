import Channel from './channel'
import { Signal } from './signal'

export default function initializeApi (apiCreator) {
  const channel = new Channel(null, window.parent)
  let apiInitCallbacks = new Signal()
  let createdApi

  const removeHandler = channel.addHandler('connect', (params) => {
    removeHandler()
    channel.sourceId = params.id

    createdApi = apiCreator(channel, params)

    apiInitCallbacks.dispatch(createdApi)
    apiInitCallbacks = null
  })

  return function init (initCb) {
    if (createdApi) {
      initCb(createdApi)
    } else {
      apiInitCallbacks.attach(initCb)
    }
  }
}
