import { ContentType, SpaceAPI } from './types'
import { Channel } from './channel'
import { IdsAPI } from '../typings'

const spaceMethods: Array<keyof SpaceAPI> = [
  'getContentType',
  'getEntry',
  'getEntrySnapshots',
  'getAsset',
  'getEditorInterface',

  'getPublishedEntries',
  'getPublishedAssets',
  'getContentTypes',
  'getEntries',
  'getEditorInterfaces',
  'getAssets',

  'createContentType',
  'createEntry',
  'createAsset',

  'updateContentType',
  'updateEntry',
  'updateAsset',

  'deleteContentType',
  'deleteEntry',
  'deleteAsset',

  'publishEntry',
  'publishAsset',
  'unpublishEntry',
  'unpublishAsset',

  'archiveEntry',
  'archiveAsset',
  'unarchiveEntry',
  'unarchiveAsset',

  'createUpload',
  'processAsset',
  'waitUntilAssetProcessed',

  'getUsers',

  'getAllScheduledActions',
  'getEntityScheduledActions',

  'signRequest'
]

export default function createSpace(
  channel: Channel,
  initialContentTypes: ContentType[],
  ids: IdsAPI
): SpaceAPI {
  const space = {} as SpaceAPI

  spaceMethods.forEach(methodName => {
    if (methodName === 'signRequest' && ids && !ids.app) {
      return
    }
    space[methodName] = function(...args: any[]) {
      return channel.call('callSpaceMethod', methodName, args)
    } as any
  })

  space.getCachedContentTypes = () => {
    return [...initialContentTypes]
  }

  return space
}
