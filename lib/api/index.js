import setup from './setup'
import Channel from './channel'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'

export var init = setup(createWidgetAPI)

function createWidgetAPI ({id, entry, locales, field, fieldInfo}) {
  let channel = new Channel(id, window.parent)

  return {
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel)
  }
}
