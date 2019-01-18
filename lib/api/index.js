import createInitializer from './initialize'
import Field from './field'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'
import createDialogs from './dialogs'

export var init = createInitializer(createWidgetAPI)

function createWidgetAPI (
  channel,
  { user, parameters, entry, locales, field, fieldInfo, contentType }
) {
  const createEntryField = info => new Field(channel, info, locales.default)

  return {
    user,
    parameters,
    contentType,
    locales: {
      available: locales.available,
      default: locales.default,
      names: locales.names
    },
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, createEntryField),
    space: createSpace(channel),
    window: createWindow(channel),
    dialogs: createDialogs(channel)
  }
}
