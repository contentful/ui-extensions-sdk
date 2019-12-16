module.exports = function createDialogs(channel, currentExtensionId) {
  return {
    openAlert: openSimpleDialog.bind(null, 'alert'),
    openConfirm: openSimpleDialog.bind(null, 'confirm'),
    openPrompt: openSimpleDialog.bind(null, 'prompt'),
    openExtension: openExtensionDialog.bind(null),
    selectSingleEntry: openEntitySelector.bind(null, 'Entry', false),
    selectSingleAsset: openEntitySelector.bind(null, 'Asset', false),
    selectMultipleEntries: openEntitySelector.bind(null, 'Entry', true),
    selectMultipleAssets: openEntitySelector.bind(null, 'Asset', true),
    createMultipleAssets: openBulkAssetsCreator.bind(null)
  }

  function openExtensionDialog(opts) {
    return channel.call('openDialog', 'extension', {
      id: currentExtensionId,
      ...makeOpts(opts)
    })
  }

  function openSimpleDialog(type, opts) {
    return channel.call('openDialog', type, makeOpts(opts))
  }

  function openEntitySelector(entityType, multiple, opts) {
    opts = makeOpts(opts)
    opts.entityType = entityType
    opts.multiple = multiple

    return channel.call('openDialog', 'entitySelector', opts)
  }

  function openBulkAssetsCreator(opts) {
    return channel.call('openDialog', 'bulkAssetsCreator', makeOpts(opts))
  }

  function makeOpts(opts) {
    const valid = typeof opts === 'object' && opts !== null && !Array.isArray(opts)
    return valid ? opts : {}
  }
}
