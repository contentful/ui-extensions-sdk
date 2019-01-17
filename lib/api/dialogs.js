import objectAssign from 'object-assign'

export default function createDialogs (channel) {
  return {
    openAlert: openSimpleDialog.bind(null, 'alert'),
    openConfirm: openSimpleDialog.bind(null, 'confirm'),
    openPrompt: openSimpleDialog.bind(null, 'prompt'),
    selectSingleEntry: openEntitySelector.bind(null, 'Entry', false),
    selectSingleAsset: openEntitySelector.bind(null, 'Asset', false),
    selectMultipleEntries: openEntitySelector.bind(null, 'Entry', true),
    selectMultipleAssets: openEntitySelector.bind(null, 'Asset', true)
  }

  function openSimpleDialog (type, options) {
    return channel.call('openDialog', type, options)
  }

  function openEntitySelector (entityType, multiple, options) {
    options = objectAssign({}, options, {entityType, multiple})

    return channel.call('openDialog', 'entitySelector', options)
  }
}
