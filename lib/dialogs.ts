import { Channel } from './channel'
import {
  DialogsAPI,
  OpenCustomWidgetOptions,
  OpenAlertOptions,
  OpenConfirmOptions,
  IdsAPI,
} from './types'

const isObject = (o: any) => typeof o === 'object' && o !== null && !Array.isArray(o)
const prepareOptions = (options: any) => (isObject(options) ? options : {})

export default function createDialogs(channel: Channel, ids: IdsAPI): DialogsAPI {
  return {
    openAlert: openSimpleDialog.bind(null, 'alert'),
    openConfirm: openSimpleDialog.bind(null, 'confirm'),
    openPrompt: openSimpleDialog.bind(null, 'prompt'),
    openExtension: openExtensionDialog,
    openCurrentApp: openCurrentAppDialog,
    openCurrent: openCurrentDialog,
    selectSingleEntry: openEntitySelector.bind(null, 'Entry', false),
    selectSingleAsset: openEntitySelector.bind(null, 'Asset', false),
    selectMultipleEntries: openEntitySelector.bind(null, 'Entry', true),
    selectMultipleAssets: openEntitySelector.bind(null, 'Asset', true),
    selectSingleExperience: openEntitySelector.bind(null, 'Experience', false),
    selectMultipleExperiences: openEntitySelector.bind(null, 'Experience', true),
    selectSinglePattern: openEntitySelector.bind(null, 'Pattern', false),
    selectMultiplePatterns: openEntitySelector.bind(null, 'Pattern', true),
    selectSingleComponentDefinition: openEntitySelector.bind(null, 'ComponentDefinition', false),
    selectMultipleComponentDefinitions: openEntitySelector.bind(null, 'ComponentDefinition', true),
  }

  function openSimpleDialog(type: string, options?: OpenAlertOptions | OpenConfirmOptions) {
    return channel.call('openDialog', type, prepareOptions(options)) as Promise<any>
  }

  function openExtensionDialog(optionsInput?: OpenCustomWidgetOptions) {
    let options = prepareOptions(optionsInput)

    // Use provided ID, default to the current extension.
    options = { ...options, id: options.id || ids.extension }
    if (options.id) {
      return channel.call('openDialog', 'extension', options)
    } else {
      throw new Error('Extension ID not provided.')
    }
  }

  function openCurrentDialog(options?: Omit<OpenCustomWidgetOptions, 'id'>) {
    if (ids.app) {
      return openCurrentAppDialog(options)
    } else {
      return openExtensionDialog({
        ...options,
        id: ids.extension,
      })
    }
  }

  function openCurrentAppDialog(options?: Omit<OpenCustomWidgetOptions, 'id'>) {
    options = prepareOptions(options)
    if (ids.app) {
      // Force ID of the current app.
      const withForcedId = { ...options, id: ids.app }
      return channel.call('openDialog', 'app', withForcedId)
    } else {
      throw new Error('Not in the app context.')
    }
  }

  function openEntitySelector(entityType: string, multiple: boolean, options?: any) {
    options = prepareOptions(options)
    options.entityType = entityType
    options.multiple = multiple

    return channel.call('openDialog', 'entitySelector', options) as Promise<any>
  }
}
