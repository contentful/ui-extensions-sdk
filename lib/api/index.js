import initializeApi from './initialize'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'

export var init = initializeApi(createWidgetAPI)

function createWidgetAPI (channel, {entry, locales, field, fieldInfo, contentType}) {
  return {
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel),
    contentType: contentType
  }
}
