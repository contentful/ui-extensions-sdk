module.exports = function createNavigator(channel, currentExtensionId) {
  return {
    openEntry: (id, opts) => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Entry', id })
    },
    openNewEntry: (contentTypeId, opts) => {
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Entry',
        id: null,
        contentTypeId
      })
    },
    openAsset: (id, opts) => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Asset', id })
    },
    openNewAsset: opts => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Asset', id: null })
    },
    openPageExtension: opts => {
      return channel.call('navigateToPageExtension', { extensionId: currentExtensionId, ...opts })
    }
  }
}
