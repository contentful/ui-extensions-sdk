import objectAssign from 'object-assign'

export default function createDialogs (channel) {
  return {
    selectSingleEntry: call.bind(null, 'Entry', false),
    selectSingleAsset: call.bind(null, 'Asset', false),
    selectMultipleEntries: call.bind(null, 'Entry', true),
    selectMultipleAssets: call.bind(null, 'Asset', true)
  }

  function call (entityType, multiple, options) {
    options = objectAssign({}, options, {entityType, multiple})

    return channel.call('openDialog', 'entitySelector', options)
  }
}
