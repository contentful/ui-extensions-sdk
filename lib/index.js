const createInitializer = require('./initialize')
const Field = require('./field')
const FieldLocale = require('./field-locale')
const createWindow = require('./window')
const createEntry = require('./entry')
const createSpace = require('./space')
const createDialogs = require('./dialogs')

const currentWindow = window

const init = createInitializer(currentWindow, createExtensionAPI)

module.exports = { init }

function createExtensionAPI (channel, data) {
  const { user, parameters, entry, locales, field, fieldInfo, contentType } = data
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
    window: createWindow(currentWindow, channel),
    dialogs: createDialogs(channel),
    notifier: {
      success: message => channel.send('notify', { type: 'success', message }),
      error: message => channel.send('notify', { type: 'error', message })
    }
  }
}
