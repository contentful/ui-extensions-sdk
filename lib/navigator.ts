import { NavigatorAPI, IdsAPI, NavigatorSlideInfo } from './types'
import { Channel } from './channel'
import { Signal } from './signal'
import { ReleaseProps } from 'contentful-management'

export default function createNavigator(
  channel: Channel,
  ids: IdsAPI,
  release?: ReleaseProps,
): NavigatorAPI {
  const _onSlideInSignal = new Signal<[NavigatorSlideInfo]>()

  channel.addHandler('navigateSlideIn', (data: any) => {
    _onSlideInSignal.dispatch(data)
  })

  return {
    openEntry: (id, opts) => {
      let entryInRelease: boolean = false
      if (release) {
        entryInRelease = isEntryInRelease(id, release)
      }
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Entry',
        id,
        entryInRelease,
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

function isEntryInRelease(entryId: string, release: ReleaseProps) {
  const entryIdsInRelease = release.entities.items.map((item) => item.sys.id)
  return entryIdsInRelease.includes(entryId)
}
