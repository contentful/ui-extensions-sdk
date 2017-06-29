import createInitializer from './initialize'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'
import createDialogs from './dialogs'

export var init = createInitializer(createWidgetAPI)

function createWidgetAPI (
  channel,
  {user, entry, locales, field, fieldInfo, contentType}
) {
  return {
    user,
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel),
    contentType: contentType,
    dialogs: createDialogs(channel)
  }
}
