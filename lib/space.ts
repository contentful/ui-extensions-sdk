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
  'getEntityScheduledActions',
  
  'createWebhook',
  'createWebhookWithId',
  'getWebhook',
  'getWebhooks'
]

export default function createSpace(channel, initialContentTypes) {
  const space = {} as SpaceAPI

  spaceMethods.forEach(methodName => {
    space[methodName] = function(...args) {
      return channel.call('callSpaceMethod', methodName, args)
    }
  })

  space.getCachedContentTypes = () => {
    return [...initialContentTypes]
  }

  return space
}
