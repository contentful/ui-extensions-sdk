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

  function openSimpleDialog (type, opts) {
    return channel.call('openDialog', type, opts)
  }

  function openEntitySelector (entityType, multiple, opts) {
    const valid = typeof opts === 'object' && opts !== null && !Array.isArray(opts)
    opts = valid ? opts : {}
    opts.entityType = entityType
    opts.multiple = multiple

    return channel.call('openDialog', 'entitySelector', opts)
  }
}
