import { makeField } from './field'
import { makeFieldLocale } from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'
import createDialogs from './dialogs'
import createEditor from './editor'
import createNavigator from './navigator'
import createApp from './app'
import locations from './locations'
import {
  EntryFieldInfo,
  NavigatorAPI,
  ConnectMessage,
  JSONPatchItem,
  BaseAppSDK,
  KnownAppSDK,
} from './types'
import { Channel } from './channel'
import { createAdapter } from './cmaAdapter'
import { createCMAClient } from './cma'
import { KeyValueMap } from 'contentful-management/types'

const DEFAULT_API_PRODUCERS = [
  makeSharedAPI,
  makeEntryAPI,
  makeFieldAPI,
  makeEditorAPI,
  makeWindowAPI,
]

type ProducerFunc = (
  channel: Channel,
  data: ConnectMessage,
  currentGlobal: typeof globalThis,
) => any
const LOCATION_TO_API_PRODUCERS: { [location: string]: ProducerFunc[] } = {
  [locations.LOCATION_ENTRY_FIELD]: DEFAULT_API_PRODUCERS,
  [locations.LOCATION_ENTRY_FIELD_SIDEBAR]: DEFAULT_API_PRODUCERS,
  [locations.LOCATION_ENTRY_SIDEBAR]: [makeSharedAPI, makeEntryAPI, makeEditorAPI, makeWindowAPI],
  [locations.LOCATION_ENTRY_EDITOR]: [makeSharedAPI, makeEntryAPI, makeEditorAPI],
  [locations.LOCATION_DIALOG]: [makeSharedAPI, makeDialogAPI, makeWindowAPI],
  [locations.LOCATION_PAGE]: [makeSharedAPI],
  [locations.LOCATION_HOME]: [makeSharedAPI],
  [locations.LOCATION_APP_CONFIG]: [makeSharedAPI, makeAppAPI],
}

export default function createAPI(
  channel: Channel,
  data: ConnectMessage,
  currentGlobal: typeof globalThis,
): KnownAppSDK {
  const producers = LOCATION_TO_API_PRODUCERS[data.location as string] || DEFAULT_API_PRODUCERS

  return producers.reduce((api, produce) => {
    return { ...api, ...produce(channel, data, currentGlobal) }
  }, {}) as any
}

function makeSharedAPI(
  channel: Channel,
  data: ConnectMessage,
): BaseAppSDK<KeyValueMap, KeyValueMap, never> {
  const { user, parameters, locales, ids, initialContentTypes, hostnames, release } = data
  const currentLocation = data.location || locations.LOCATION_ENTRY_FIELD

  return {
    cma: createCMAClient(ids, channel),
    cmaAdapter: createAdapter(channel),
    location: {
      is: (tested: string) => currentLocation === tested,
    },
    user,
    parameters,
    locales: {
      available: locales.available,
      default: locales.default,
      names: locales.names,
      fallbacks: locales.fallbacks,
      optional: locales.optional,
      direction: locales.direction,
    },
    space: createSpace(channel, initialContentTypes),
    dialogs: createDialogs(channel, ids),
    // Typecast because promises returned by navigator methods aren't typed
    navigator: createNavigator(channel, ids) as NavigatorAPI,
    notifier: {
      success: (message: string) => channel.send('notify', { type: 'success', message }),
      error: (message: string) => channel.send('notify', { type: 'error', message }),
      warning: (message: string) => channel.send('notify', { type: 'warning', message }),
    },
    ids,
    hostnames,
    release,
    access: {
      can: (action: string, entity: any, patch?: JSONPatchItem[]) =>
        channel.call('checkAccess', action, entity, patch) as Promise<boolean>,
      canEditAppConfig: () => channel.call('checkAppConfigAccess') as Promise<boolean>,
    },
  }
}

function makeWindowAPI(channel: Channel, _data: any, currentGlobal: typeof globalThis) {
  return {
    window: createWindow(currentGlobal, channel),
  }
}

function makeEditorAPI(channel: Channel, data: any) {
  const { editorInterface, editor } = data
  return {
    editor: createEditor(channel, editorInterface, editor),
  }
}

function makeEntryAPI(
  channel: Channel,
  { locales, contentType, entry, fieldInfo }: ConnectMessage,
) {
  const createEntryField = (info: EntryFieldInfo) => makeField(channel, info, locales.default)

  return {
    contentType,
    entry: createEntry(channel, entry, fieldInfo, createEntryField),
  }
}

function makeFieldAPI(channel: Channel, { field }: ConnectMessage) {
  if (!field) {
    throw new Error('FieldAPI called for location without "field" property defined.')
  }

  return {
    field: makeFieldLocale(channel, field),
  }
}

function makeDialogAPI(channel: Channel) {
  return {
    close: (data: any) => channel.send('closeDialog', data),
  }
}

function makeAppAPI(channel: Channel) {
  const app = createApp(channel)

  return {
    app,
  }
}
