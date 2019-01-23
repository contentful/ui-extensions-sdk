module.exports = function createNavigator (channel) {
  return {
    openEntry: (id, opts) => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Entry', id })
    },
    openNewEntry: (contentTypeId, opts) => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Entry', id: null, contentTypeId })
    },
    openAsset: (id, opts) => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Asset', id })
    },
    openNewAsset: opts => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Asset', id: null })
    }
  }
}
