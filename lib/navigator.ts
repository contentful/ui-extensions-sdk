import { NavigatorAPI, IdsAPI, NavigatorSlideInfo, NavigatorAPIOptions } from './types'
import { Channel } from './channel'
import { Signal } from './signal'

export default function createNavigator(channel: Channel, ids: IdsAPI): NavigatorAPI {
  const _onSlideInSignal = new Signal<[NavigatorSlideInfo]>()

  channel.addHandler('navigateSlideIn', (data: any) => {
    _onSlideInSignal.dispatch(data)
  })

  return {
    openEntry: (entryId: string, opts: NavigatorAPIOptions | undefined) => {
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Entry',
        // This is the id of the entry to open
        id: entryId,
        releaseId: opts?.releaseId,
      }) as Promise<any>
    },
    openNewEntry: (contentTypeId: string, opts) => {
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Entry',
        id: null,
        contentTypeId,
      }) as Promise<any>
    },
    openBulkEditor: (entryId: string, opts) => {
      return channel.call('navigateToBulkEditor', {
        entryId,
        ...opts,
      }) as Promise<any>
    },
    openAsset: (id, opts) => {
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Asset',
        id,
      }) as Promise<any>
    },
    openNewAsset: (opts) => {
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Asset',
        id: null,
      }) as Promise<any>
    },
    openPageExtension: (opts) => {
      return channel.call('navigateToPage', {
        type: 'extension',
        id: ids.extension,
        ...opts,
      }) as Promise<any>
    },
    openCurrentAppPage: (opts) => {
      return channel.call('navigateToPage', { type: 'app', id: ids.app, ...opts }) as Promise<any>
    },
    openAppConfig: () => {
      return channel.call('navigateToAppConfig') as Promise<void>
    },
    openEntriesList: () => {
      return channel.call('navigateToSpaceEnvRoute', { route: 'entries' }) as Promise<void>
    },
    openAssetsList: () => {
      return channel.call('navigateToSpaceEnvRoute', { route: 'assets' }) as Promise<void>
    },
    onSlideInNavigation: (handler) => {
      return _onSlideInSignal.attach(handler)
    },
  }
}
