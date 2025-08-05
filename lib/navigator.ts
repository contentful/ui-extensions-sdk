import { NavigatorAPI, IdsAPI, NavigatorSlideInfo, NavigatorAPIOptions, Release } from './types'
import { Channel } from './channel'
import { Signal } from './signal'

export default function createNavigator(
  channel: Channel,
  ids: IdsAPI,
  release: Release | undefined,
): NavigatorAPI {
  const _onSlideInSignal = new Signal<[NavigatorSlideInfo]>()

  channel.addHandler('navigateSlideIn', (data: any) => {
    _onSlideInSignal.dispatch(data)
  })

  return {
    openEntry: (entryId: string, opts: NavigatorAPIOptions | undefined) => {
      let entityInRelease: boolean = false

      if (release) {
        entityInRelease = isEntityInRelease(entryId, release)
      }

      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Entry',
        // This is the id of the entry to open
        id: entryId,
        entityInRelease,
        // releaseId coming from user to open an entry in, not from release itself..
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
      let entityInRelease: boolean = false

      if (release) {
        entityInRelease = isEntityInRelease(id, release)
      }
      return channel.call('navigateToContentEntity', {
        ...opts,
        entityType: 'Asset',
        id,
        entityInRelease,
        // releaseId coming from user to open an asset in, not from release itself.
        releaseId: opts?.releaseId,
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
      return channel.call('navigateToSpaceEnvRoute', {
        route: 'entries',
        releaseId: release?.sys?.id,
      }) as Promise<void>
    },
    openAssetsList: () => {
      return channel.call('navigateToSpaceEnvRoute', {
        route: 'assets',
        releaseId: release?.sys?.id,
      }) as Promise<void>
    },
    onSlideInNavigation: (handler) => {
      return _onSlideInSignal.attach(handler)
    },
  }
}

function isEntityInRelease(entityId: string, release: Release | undefined): boolean {
  const releaseEntityIds = release?.entities?.items?.map((entity) => entity.sys.id) ?? []
  return releaseEntityIds.includes(entityId)
}
