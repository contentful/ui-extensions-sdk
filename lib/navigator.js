const { Signal } = require('./signal')

module.exports = function createNavigator(channel, currentExtensionId) {
  const _onSlideInSignal = new Signal()

  channel.addHandler('navigateSlideIn', data => {
    _onSlideInSignal.dispatch(data)
  })

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
    openBulkEditor: (entryId, opts) => {
      return channel.call('navigateToBulkEditor', {
        entryId,
        ...opts
      })
    },
    openAsset: (id, opts) => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Asset', id })
    },
    openNewAsset: opts => {
      return channel.call('navigateToContentEntity', { ...opts, entityType: 'Asset', id: null })
    },
    openPageExtension: opts => {
      return channel.call('navigateToPageExtension', { id: currentExtensionId, ...opts })
    },
    onSlideInNavigation: handler => {
      return _onSlideInSignal.attach(handler)
    }
  }
}
