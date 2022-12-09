import { ContentType, SpaceAPI } from './types'
import { Channel } from './channel'
import { Signal } from './signal'

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
  initialContentTypes: ContentType[]
): SpaceAPI {
  const spaceApi = {} as SpaceAPI

  const taskCreated = new Signal()
  const taskUpdated = new Signal()
  const taskDeleted = new Signal()

  channel.addHandler(
    'spaceCallbacks',
    ({ method, params }: { method: string; params: { entityType: string; entityId: string } }) => {
      if (method === 'taskCreated') {
        taskCreated.dispatch(params.entityType, params.entityId)
      } else if (method === 'taskUpdated') {
        taskUpdated.dispatch(params.entityType, params.entityId)
      } else if (method === 'taskDeleted') {
        taskDeleted.dispatch(params.entityType, params.entityId)
      } else {
        console.error('Unexpected space callback method', method)
      }
    }
  )

  spaceMethods.forEach((methodName) => {
    if (methodName)
      spaceApi[methodName] = function (...args: any[]) {
        console.warn(
          `You called ${String(
            methodName
          )} on the Space API. Since version 4.0.0 the Space API and its methods are deprecated, and they will be removed from version 5.0.0 on. We recommend that you use the CMA client instead. See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details.`
        )
        return channel.call('callSpaceMethod', methodName, args)
      } as any
  })

  spaceApi.getCachedContentTypes = () => {
    return [...initialContentTypes]
  }

  return {
    ...spaceApi,
    onTaskCreated(handler: Function) {
      return taskCreated.attach(handler)
    },
    onTaskUpdated(handler: Function) {
      return taskUpdated.attach(handler)
    },
    onTaskDeleted(handler: Function) {
      return taskDeleted.attach(handler)
    },
  } as SpaceAPI
}
