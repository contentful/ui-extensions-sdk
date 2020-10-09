import Field from './field'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'
import createDialogs from './dialogs'
import createEditor from './editor'
import createNavigator from './navigator'
import createApp from './app'
import locations from './locations'
import { BaseExtensionSDK, EntryFieldInfo, FieldInfo, NavigatorAPI, KnownSDK } from './types'
import { Channel } from './channel'

const DEFAULT_API_PRODUCERS = [
  makeSharedAPI,
  makeEntryAPI,
  makeFieldAPI,
  makeEditorAPI,
  makeWindowAPI
]

// TODO; typing for return value
type producerFunc = (chanell: Channel, data: any, currentWindow: Window) => any
const LOCATION_TO_API_PRODUCERS: { [location: string]: producerFunc[] } = {
  [locations.LOCATION_ENTRY_FIELD]: DEFAULT_API_PRODUCERS,
  [locations.LOCATION_ENTRY_FIELD_SIDEBAR]: DEFAULT_API_PRODUCERS,
  [locations.LOCATION_ENTRY_SIDEBAR]: [makeSharedAPI, makeEntryAPI, makeEditorAPI, makeWindowAPI],
  [locations.LOCATION_ENTRY_EDITOR]: [makeSharedAPI, makeEntryAPI, makeEditorAPI],
  [locations.LOCATION_DIALOG]: [makeSharedAPI, makeDialogAPI, makeWindowAPI],
  [locations.LOCATION_PAGE]: [makeSharedAPI],
  [locations.LOCATION_APP_CONFIG]: [makeSharedAPI, makeAppAPI]
}

// TODO Remove any once we know payload
// TODO data is directly received through event passthrough
export default function createAPI(channel: Channel, data: any, currentWindow: Window): KnownSDK {
  const producers = LOCATION_TO_API_PRODUCERS[data.location as string] || DEFAULT_API_PRODUCERS

  return producers.reduce((api, produce) => {
    return { ...api, ...produce(channel, data, currentWindow) }
  }, {}) as any
}

function makeSharedAPI(channel: Channel, data: any): BaseExtensionSDK {
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
    // Typecast because promises returned by navigator methods aren't typed
    navigator: createNavigator(channel, ids) as NavigatorAPI,
    notifier: {
      success: message => channel.send('notify', { type: 'success', message }),
      error: message => channel.send('notify', { type: 'error', message })
    },
    ids,
    access: {
      can: (action: string, entity: any) =>
        channel.call('checkAccess', action, entity) as Promise<boolean>
    }
  }
}

function makeWindowAPI(channel: Channel, _data: any, currentWindow: Window) {
  return {
    window: createWindow(currentWindow, channel)
  }
}

function makeEditorAPI(channel: Channel, data: any) {
  const { editorInterface } = data
  return {
    editor: createEditor(channel, editorInterface)
  }
}

function makeEntryAPI(
  channel: Channel,
  {
    locales,
    contentType,
    entry,
    fieldInfo
  }: { locales: any; contentType: string; entry: any; fieldInfo: any }
) {
  const createEntryField = (info: EntryFieldInfo) => new Field(channel, info, locales.default)

  return {
    contentType,
    entry: createEntry(channel, entry, fieldInfo, createEntryField)
  }
}

function makeFieldAPI(channel: Channel, { field }: { field: FieldInfo }) {
  return {
    field: new FieldLocale(channel, field)
  }
}

function makeDialogAPI(channel: Channel) {
  return {
    close: (data: any) => channel.send('closeDialog', data)
  }
}

function makeAppAPI(channel: Channel) {
  const app = createApp(channel)

  return {
    app
  }
}
