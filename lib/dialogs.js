module.exports = function createDialogs (channel) {
  return {
    openAlert: openSimpleDialog.bind(null, 'alert'),
    openConfirm: openSimpleDialog.bind(null, 'confirm'),
    openPrompt: openSimpleDialog.bind(null, 'prompt'),
    openExtension: openSimpleDialog.bind(null, 'extension'),
    selectSingleEntry: openEntitySelector.bind(null, 'Entry', false),
    selectSingleAsset: openEntitySelector.bind(null, 'Asset', false),
    selectMultipleEntries: openEntitySelector.bind(null, 'Entry', true),
    selectMultipleAssets: openEntitySelector.bind(null, 'Asset', true)
  }

  function openSimpleDialog (type, opts) {
    return channel.call('openDialog', type, makeOpts(opts))
  }

  function openEntitySelector (entityType, multiple, opts) {
    opts = makeOpts(opts)
    opts.entityType = entityType
    opts.multiple = multiple

    return channel.call('openDialog', 'entitySelector', opts)
  }

  function makeOpts (opts) {
    const valid = typeof opts === 'object' && opts !== null && !Array.isArray(opts)
    return valid ? opts : {}
  }
}
