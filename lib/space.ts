import { ContentType } from '../typings'
import { Channel } from './channel'
import { SpaceAPI } from './types'

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
  'getEntityScheduledActions'
]

export default function createSpace(channel: Channel, initialContentTypes: ContentType[]) {
  const space = {} as SpaceAPI

  spaceMethods.forEach(methodName => {
    // TODO remove use of "any" here
    space[methodName] = function(...args: any[]) {
      return channel.call('callSpaceMethod', methodName, args)
    } as any
  })

  space.getCachedContentTypes = () => {
    return [...initialContentTypes]
  }

  return space
}
