import { ContentType, SpaceAPI } from './types'
import { Channel } from './channel'

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
]

export default function createSpace(
  channel: Channel,
  initialContentTypes: ContentType[]
): SpaceAPI {
  const space = {} as SpaceAPI

  spaceMethods.forEach((methodName) => {
    space[methodName] = function (...args: any[]) {
      return channel.call('callSpaceMethod', methodName, args)
    } as any
  })

  space.getCachedContentTypes = () => {
    return [...initialContentTypes]
  }

  return space
}
