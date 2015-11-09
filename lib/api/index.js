import Channel from './channel'

import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'

window.contentfulWidget = setup()
export default window.contentfulWidget

function setup () {
  let readyCallbacks = []
  let widget = null

  window.addEventListener('message', initializer)

  return {init}

  function initializer (event) {
    let method = event.data.method
    let params = event.data.params

    if (method !== 'connect') {
      return
    }

    widget = createWidgetAPI(params)
    window.removeEventListener('message', initializer)

    readyCallbacks.forEach((cb) => cb(widget))
  }

  function init (cb) {
    if (widget) {
      cb(widget)
    } else {
      readyCallbacks.push(cb)
    }
  }
}


function createWidgetAPI ({id, entry, locales, field, fieldInfo}) {
  let channel = new Channel(id)

  return {
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel)
  }
}
