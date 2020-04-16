const Field = require('./field')
const FieldLocale = require('./field-locale')
const createWindow = require('./window')
const createEntry = require('./entry')
const createSpace = require('./space')
const createDialogs = require('./dialogs')
const createEditor = require('./editor')
const createNavigator = require('./navigator')
const createApp = require('./app')
const locations = require('./locations')

const DEFAULT_API_PRODUCERS = [
  makeSharedAPI,
  makeEntryAPI,
  makeFieldAPI,
  makeEditorAPI,
  makeWindowAPI
]

const LOCATION_TO_API_PRODUCERS = {
  [locations.LOCATION_ENTRY_FIELD]: DEFAULT_API_PRODUCERS,
  [locations.LOCATION_ENTRY_FIELD_SIDEBAR]: DEFAULT_API_PRODUCERS,
  [locations.LOCATION_ENTRY_SIDEBAR]: [makeSharedAPI, makeEntryAPI, makeEditorAPI, makeWindowAPI],
  [locations.LOCATION_ENTRY_EDITOR]: [makeSharedAPI, makeEntryAPI, makeEditorAPI],
  [locations.LOCATION_DIALOG]: [makeSharedAPI, makeDialogAPI, makeWindowAPI],
  [locations.LOCATION_PAGE]: [makeSharedAPI],
  [locations.LOCATION_APP_CONFIG]: [makeSharedAPI, makeAppAPI]
}

module.exports = function createAPI(channel, data, currentWindow) {
  const producers = LOCATION_TO_API_PRODUCERS[data.location] || DEFAULT_API_PRODUCERS

  return producers.reduce((api, produce) => {
    return { ...api, ...produce(channel, data, currentWindow) }
  }, {})
}

function makeSharedAPI(channel, data) {
  const { user, parameters, locales, ids, initialContentTypes } = data
  const currentLocation = data.location || locations.LOCATION_ENTRY_FIELD

  return {
    location: {
      is: tested => currentLocation === tested
    },
    user,
    parameters,
    locales: {
      available: locales.available,
      default: locales.default,
      names: locales.names,
      fallbacks: locales.fallbacks,
      optional: locales.optional,
      direction: locales.direction
    },
    space: createSpace(channel, initialContentTypes),
    dialogs: createDialogs(channel, ids),
    navigator: createNavigator(channel, ids.extension),
    notifier: {
      success: message => channel.send('notify', { type: 'success', message }),
      error: message => channel.send('notify', { type: 'error', message })
    },
    ids
  }
}

function makeWindowAPI(channel, _data, currentWindow) {
  return {
    window: createWindow(currentWindow, channel)
  }
}

function makeEditorAPI(channel, data) {
  const { editorInterface } = data
  return {
    editor: createEditor(channel, editorInterface)
  }
}

function makeEntryAPI(channel, { locales, contentType, entry, fieldInfo }) {
  const createEntryField = info => new Field(channel, info, locales.default)

  return {
    contentType,
    entry: createEntry(channel, entry, fieldInfo, createEntryField)
  }
}

function makeFieldAPI(channel, { field }) {
  return {
    field: new FieldLocale(channel, field)
  }
}

function makeDialogAPI(channel) {
  return {
    close: data => channel.send('closeDialog', data)
  }
}

function makeAppAPI(channel) {
  const app = createApp(channel)

  return {
    app
  }
}
