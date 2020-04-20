import { Signal } from './signal'

export default function createNavigator(channel, ids) {
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
      return channel.call('navigateToPage', { type: 'extension', id: ids.extension, ...opts })
    },
    openCurrentAppPage: opts => {
      return channel.call('navigateToPage', { type: 'app', id: ids.app, ...opts })
    },
    onSlideInNavigation: handler => {
      return _onSlideInSignal.attach(handler)
    }
  }
}
