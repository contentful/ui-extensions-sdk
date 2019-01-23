const Field = require('./field')
const FieldLocale = require('./field-locale')
const createWindow = require('./window')
const createEntry = require('./entry')
const createSpace = require('./space')
const createDialogs = require('./dialogs')
const createNavigator = require('./navigator')

const DEFAULT_API_PRODUCERS = [
  makeSharedAPI,
  makeEntryAPI,
  makeFieldAPI
]

const LOCATION_TO_API_PRODUCERS = {
  'entry-field': DEFAULT_API_PRODUCERS,
  'entry-sidebar': [makeSharedAPI, makeEntryAPI]
}

module.exports = function createAPI (channel, data, currentWindow) {
  const producers = LOCATION_TO_API_PRODUCERS[data.location] || DEFAULT_API_PRODUCERS

  return producers.reduce((api, produce) => {
    return { ...api, ...produce(channel, data, currentWindow) }
  }, {})
}

function makeSharedAPI (channel, data, currentWindow) {
  const { user, parameters, locales } = data

  return {
    user,
    parameters,
    locales: {
      available: locales.available,
      default: locales.default,
      names: locales.names
    },
    space: createSpace(channel),
    window: createWindow(currentWindow, channel),
    dialogs: createDialogs(channel),
    navigator: createNavigator(channel),
    notifier: {
      success: message => channel.send('notify', { type: 'success', message }),
      error: message => channel.send('notify', { type: 'error', message })
    }
  }
}

function makeEntryAPI (channel, { locales, contentType, entry, fieldInfo }) {
  const createEntryField = info => new Field(channel, info, locales.default)

  return {
    contentType,
    entry: createEntry(channel, entry, fieldInfo, createEntryField)
  }
}

function makeFieldAPI (channel, { field }) {
  return {
    field: new FieldLocale(channel, field)
  }
}
