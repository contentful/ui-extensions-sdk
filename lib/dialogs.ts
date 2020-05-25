const isObject = o => typeof o === 'object' && o !== null && !Array.isArray(o)
const prepareOptions = options => (isObject(options) ? options : {})

export default function createDialogs(channel, ids) {
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
    selectMultipleAssets: openEntitySelector.bind(null, 'Asset', true)
  }

  function openSimpleDialog(type, options?) {
    return channel.call('openDialog', type, prepareOptions(options))
  }

  function openExtensionDialog(options?) {
    options = prepareOptions(options)

    // Use provided ID, default to the current extension.
    options.id = options.id || ids.extension
    if (options.id) {
      return channel.call('openDialog', 'extension', options)
    } else {
      throw new Error('Extension ID not provided.')
    }
  }

  function openCurrentDialog(options?) {
    if (ids.app) {
      return openCurrentAppDialog(options)
    } else {
      options.id = ids.extension
      return openExtensionDialog(options)
    }
  }

  function openCurrentAppDialog(options?) {
    options = prepareOptions(options)
    // Force ID of the current app.
    options.id = ids.app
    if (options.id) {
      return channel.call('openDialog', 'app', options)
    } else {
      throw new Error('Not in the app context.')
    }
  }

  function openEntitySelector(entityType, multiple, options?) {
    options = prepareOptions(options)
    options.entityType = entityType
    options.multiple = multiple

    return channel.call('openDialog', 'entitySelector', options)
  }
}
