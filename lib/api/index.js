import createInitializer from './initialize'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'
import createTools from './tools'

export var init = createInitializer(createWidgetAPI)

function createWidgetAPI (channel, {entry, locales, field, fieldInfo, contentType}) {
  return {
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel),
    contentType: contentType,
    tools: createTools(channel)
  }
}
