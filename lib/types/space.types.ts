import {
  Asset,
  CanonicalRequest,
  ContentType,
  EditorInterface,
  ScheduledAction,
  Tag,
  Team,
  User,
  TagVisibility,
  KeyValueMap,
  Entry,
  QueryOptions,
  Upload,
} from './entities'
import { CollectionResponse, ContentEntityType, Link, WithOptionalId, SearchQuery } from './utils'

type Snapshot<T> = {
  sys: {
    space?: Link
    status?: Link
    publishedVersion?: number
    archivedVersion?: number
    archivedBy?: Link
    archivedAt?: string
    deletedVersion?: number
    deletedBy?: Link
    deletedAt?: string
    snapshotType: string
    snapshotEntityType: string
  }
  snapshot: T
}

export interface SpaceAPI {
  /**
   * @deprecated since version 4.0.0
   * Please using `cma.contentType.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getCachedContentTypes: () => ContentType[]
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.contentType.get` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getContentType: (id: string) => Promise<ContentType>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.contentType.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getContentTypes: <Query extends SearchQuery = SearchQuery>(
    query?: Query
  ) => Promise<CollectionResponse<ContentType>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.contentType.create` or `cma.contentType.createWithId` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  createContentType: (data: WithOptionalId<ContentType>) => Promise<ContentType>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.contentType.update` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  updateContentType: (data: ContentType) => Promise<ContentType>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.contentType.delete` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  deleteContentType: (contentTypeId: string) => Promise<void>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.get` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getEntry: <Fields extends KeyValueMap = KeyValueMap>(id: string) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.snapshot.getForEntry` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getEntrySnapshots: <Fields extends KeyValueMap = KeyValueMap>(
    id: string
  ) => Promise<CollectionResponse<Snapshot<Entry<Fields>>>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getEntries: <Fields, Query extends SearchQuery = SearchQuery>(
    query?: Query
  ) => Promise<CollectionResponse<Entry<Fields>>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.create` or `cma.entry.createWithId` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  createEntry: <Fields>(
    contentTypeId: string,
    data: WithOptionalId<Entry<Fields>>
  ) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.update` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  updateEntry: <Fields extends KeyValueMap = KeyValueMap>(
    data: Entry<Fields>
  ) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.publish` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  publishEntry: <Fields extends KeyValueMap = KeyValueMap>(
    data: Entry<Fields>
  ) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.unpublish` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  unpublishEntry: <Fields extends KeyValueMap = KeyValueMap>(
    data: Entry<Fields>
  ) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.archive` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  archiveEntry: <Fields extends KeyValueMap = KeyValueMap>(
    data: Entry<Fields>
  ) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.unarchive` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  unarchiveEntry: <Fields extends KeyValueMap = KeyValueMap>(
    data: Entry<Fields>
  ) => Promise<Entry<Fields>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.delete` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  deleteEntry: <Fields extends KeyValueMap = KeyValueMap>(data: Entry<Fields>) => Promise<void>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.entry.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getPublishedEntries: <Fields, Query extends SearchQuery = SearchQuery>(
    query?: Query
  ) => Promise<CollectionResponse<Entry<Fields>>>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.get` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getAsset: (id: string) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getAssets: <Query extends SearchQuery = SearchQuery>(
    query?: Query
  ) => Promise<CollectionResponse<Asset>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.create` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  createAsset: (data: WithOptionalId<Asset>) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.update` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  updateAsset: (data: Asset) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.delete` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  deleteAsset: (data: Asset) => Promise<void>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.publish` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  publishAsset: (data: Asset) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.unpublish` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  unpublishAsset: (data: Asset) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.archive` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  archiveAsset: (data: Asset) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.processForLocale` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  processAsset: (data: Asset, locale: string) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.unarchive` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  unarchiveAsset: (data: Asset) => Promise<Asset>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.asset.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getPublishedAssets: <Query extends SearchQuery = SearchQuery>(
    query?: Query
  ) => Promise<CollectionResponse<Asset>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.upload.create` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  createUpload: (base64data: string) => Promise<Upload>
  /**
   * @deprecated since version 4.0.0
   * Consider polling `cma.asset.get` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  waitUntilAssetProcessed: (assetId: string, locale: string) => Promise<Asset>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.user.getManyForSpace` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   * Returns all users who belong to the space.
   */
  getUsers: () => Promise<CollectionResponse<User>>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.editorInterface.get` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   * Returns editor interface for a given content type
   */
  getEditorInterface: (contentTypeId: string) => Promise<EditorInterface>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.editorInterface.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   * Returns editor interfaces for a given environment
   */
  getEditorInterfaces: () => Promise<CollectionResponse<EditorInterface>>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.scheduledActions.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   * Returns a list of scheduled actions for a given entity
   */
  getEntityScheduledActions: (
    entityType: ContentEntityType,
    entityId: string
  ) => Promise<ScheduledAction[]>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.scheduledActions.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   * Returns a list of scheduled actions for the currenst space & environment
   */
  getAllScheduledActions: () => Promise<ScheduledAction[]>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.appSignedRequest.create` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  signRequest: (request: CanonicalRequest) => Promise<Record<string, string>>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.tag.create` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  createTag: (id: string, name: string, visibility?: TagVisibility) => Promise<Tag>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.tag.getMany` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  readTags: (skip: number, limit: number) => Promise<CollectionResponse<Tag>>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.tag.update` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  updateTag: (id: string, name: string, version: number) => Promise<Tag>
  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.tag.delete` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  deleteTag: (id: string, version: number) => Promise<boolean>

  /**
   * @deprecated since version 4.0.0
   * Consider using `cma.team.get` instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  getTeams: (query: QueryOptions) => Promise<CollectionResponse<Team>>
}
