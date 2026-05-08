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

  'signRequest',

  'createTag',
  'readTags',
  'updateTag',
  'deleteTag',

  'getTeams',
]

export default function createSpace(
  channel: Channel,
  initialContentTypes: ContentType[],
): SpaceAPI {
  const space = {} as SpaceAPI

  spaceMethods.forEach((methodName) => {
    space[methodName] = function (...args: any[]) {
      console.warn(
        `You called ${String(
          methodName,
        )} on the Space API. Since version 4.0.0 the Space API and its methods are deprecated, and they will be removed from version 5.0.0 on. We recommend that you use the CMA client instead. See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details.`,
      )
      return channel.call('callSpaceMethod', methodName, args)
    } as any
  })

  space.getCachedContentTypes = () => {
    return [...initialContentTypes]
  }

  return space
}
