import {
  ContentType,
  EditorInterface,
  SpaceMembership,
  Role,
  ContentTypeField,
  Metadata,
  Entry,
  Task,
  Asset,
  Release,
  WorkflowDefinition,
} from './entities'
import { EntryAPI } from './entry.types'
import { SpaceAPI } from './space.types'
import { WindowAPI } from './window.types'
import { EntrySys, Link, SerializedJSONValue } from './utils'
import { FieldAPI } from './field-locale.types'
import { DialogsAPI } from './dialogs.types'
import { AppConfigAPI } from './app.types'
import { NavigatorAPI } from './navigator.types'
import { EntryFieldInfo, FieldInfo } from './field.types'
import { Adapter, KeyValueMap } from 'contentful-management/types'
import { CMAClient } from './cmaClient.types'

/* User API */

export interface UserAPI {
  sys: {
    id: string
    type: string
  }
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  // Although called SpaceMembership, this type does not abide to entity
  // with same name. Keeping it the same (with more precise types) for
  // backwards compatibility
  spaceMembership: {
    sys: Pick<SpaceMembership['sys'], 'id' | 'type'>
    admin: SpaceMembership['admin']
    roles: Pick<Role, 'name' | 'description'>[]
  }
}

/* Locales API */
export interface LocalesAPI {
  /** The default locale code for the current space. */
  default: string
  /** A list of locale codes of all locales available for editing in the current space. */
  available: string[]
  /** An object with keys of locale codes and values of corresponding human-readable locale names. */
  names: { [key: string]: string }
  /** An object with keys of locale codes and values of corresponding fallback locale codes. If there's no fallback then the value is undefined. */
  fallbacks: { [key: string]: string | undefined }
  /** An object with keys of locale codes and values of corresponding boolean value indicating if the locale is optional or not. */
  optional: { [key: string]: boolean }
  /** An object with keys of locale codes and values of corresponding information indicating if the locale is right-to-left or left-to-right language. */
  direction: { [key: string]: 'ltr' | 'rtl' }
}

/* Notifier API */

export interface NotifierAPI {
  /** Displays a success notification in the notification area of the Web App. */
  success: (message: string) => void
  /** Displays an error notification in the notification area of the Web App. */
  error: (message: string) => void
  /** Displays a warning notification in the notification area of the Web App. */
  warning: (message: string) => void
}

/* Location API */

export interface LocationAPI {
  /** Checks the location in which your app is running */
  is: (type: string) => boolean
}

/* Parameters API */

export interface ParametersAPI<
  InstallationParameters extends KeyValueMap,
  InstanceParameters extends KeyValueMap,
  InvocationParameters extends SerializedJSONValue,
> {
  installation: InstallationParameters
  instance: InstanceParameters
  invocation: InvocationParameters
}

/* IDs */

export interface IdsAPI {
  user: string
  extension?: string
  organization: string
  app?: string
  space: string
  environment: string
  environmentAlias?: string
  field: string
  entry: string
  contentType: string
  release?: string
}

/** Hostnames */
export interface HostnamesAPI {
  /** Hostname of the Content Delivery API */
  delivery: string
  /** Hostname of the Content Management API */
  management: string
  /** Hostname of the Preview API */
  preview: string
  /** Hostname of the Upload API */
  upload: string
  /** Hostname of the GraphQL API */
  graphql: string
  /** Hostname of the Web App */
  webapp: string
}

/** Content API */
export interface ContentTypeAPI {
  sys: {
    id: string
    type: 'ContentType'
    revision: number
    space: Link<'Space', 'Link'>
    environment: Link<'Environment', 'Link'>
    createdAt?: string
    updatedAt?: string
  }
  fields: ContentTypeField[]
  name: string
  displayField: string
  description: string
}

export interface EditorLocaleSettings {
  mode: 'multi' | 'single'
  focused?: string
  active?: Array<string>
}

export interface SharedEditorSDK {
  editor: {
    editorInterface: EditorInterface

    /**
     * Returns the current locale settings
     *
     * The locale setting can change. To always work with the latest settings, use `onLocaleSettingsChanged`.
     */
    getLocaleSettings(): EditorLocaleSettings

    /**
     * Subscribes to changes of the editor's locale settings
     *
     * @param callback Function that is called every time the locale settings change. Called immidiately with the current setting.
     * @returns Function to unsubscribe. `callback` won't be called anymore.
     */
    onLocaleSettingsChanged: (
      callback: (localeSettings: EditorLocaleSettings) => void,
    ) => () => void

    /**
     * Subscribes to changes of whether or not disabled fields are displayed
     *
     * @param callback Function that is called every time the setting whether or not disabled fields are displayed changes. Called immediately with the current state.
     * @returns Function to unsubscribe. `callback` won't be called anymore.
     * @deprecated Use {@link onShowHiddenFieldsChanged} instead
     */
    onShowDisabledFieldsChanged: (callback: (showDisabledFields: boolean) => void) => () => void

    /**
     * Returns whether or not hidden fields are displayed
     *
     * This setting can change. To always work with the latest settings, use `onShowHiddenFieldsChanged`.
     */
    getShowHiddenFields(): boolean

    /**
     * Subscribes to changes of whether or not hidden fields are displayed
     *
     * @param callback Function that is called every time the setting whether or not hidden fields are displayed changes. Called immediately with the current state.
     * @returns Function to unsubscribe. `callback` won't be called anymore.
     */
    onShowHiddenFieldsChanged: (callback: (showHiddenFields: boolean) => void) => () => void
  }

  /**
   * Allows to read and update the value of any field of the current entry and to get the entry's metadata
   */
  entry: EntryAPI
  /**
   * Information about the content type of the entry.
   */
  contentType: ContentTypeAPI
}

export type CrudAction = 'create' | 'read' | 'update' | 'delete'
export type PublishableAction = 'publish' | 'unpublish'
export type ArchiveableAction = 'archive' | 'unarchive'
export type JSONPatchItem = {
  op: 'remove' | 'replace' | 'add'
  path: string
  value?: any
}
type PatchEntity = Entry | Task | Asset | WorkflowDefinition

export interface AccessAPI {
  can(action: 'read' | 'update', entity: 'EditorInterface' | EditorInterface): Promise<boolean>

  can<T = Object>(
    action: CrudAction,
    entity: 'ContentType' | ContentType | 'Asset' | 'Entry' | T,
  ): Promise<boolean>

  can<T = Object>(
    action: PublishableAction,
    entity: 'ContentType' | ContentType | 'Asset' | 'Entry' | T,
  ): Promise<boolean>

  can<T = Object>(action: ArchiveableAction, entity: 'Asset' | 'Entry' | T): Promise<boolean>

  can(action: 'update', entity: PatchEntity, patch: JSONPatchItem[]): Promise<boolean>

  /** Whether the current user can edit app config */
  canEditAppConfig: () => Promise<boolean>
}

type EntryScopedIds = 'field' | 'entry' | 'contentType'

export interface BaseAppSDK<
  InstallationParameters extends KeyValueMap = KeyValueMap,
  InstanceParameters extends KeyValueMap = KeyValueMap,
  InvocationParameters extends SerializedJSONValue = SerializedJSONValue,
> {
  /** @deprecated since version 4.0.0 consider using the CMA instead
   * See https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library for more details
   */
  space: SpaceAPI
  /** Information about the current user and roles */
  user: UserAPI
  /** Information about the current locales */
  locales: LocalesAPI
  /** Methods for opening UI dialogs: */
  dialogs: DialogsAPI
  /** Methods for navigating between entities stored in a Contentful space. */
  navigator: NavigatorAPI
  /** Methods for displaying notifications. */
  notifier: NotifierAPI
  /** Exposes app configuration parameters */
  parameters: ParametersAPI<InstallationParameters, InstanceParameters, InvocationParameters>
  /** Exposes method to identify app's location */
  location: LocationAPI
  /** Exposes methods for checking user's access level */
  access: AccessAPI
  /** Exposes relevant ids, keys may be ommited based on location */
  ids: Omit<IdsAPI, EntryScopedIds>
  /** Exposes hostnames to interact with Contentful's API or to link to the web app */
  hostnames: HostnamesAPI
  /** Adapter to be injected in contentful-management client */
  cmaAdapter: Adapter
  /** A CMA Client initialized with default params */
  cma: CMAClient
  /** Current release context, undefined if not editing within a release */
  release?: Release
  /** Current language locale set in the web app */
  uiLanguageLocale?: string
}

export type EditorAppSDK<
  InstallationParameters extends KeyValueMap = KeyValueMap,
  InstanceParameters extends KeyValueMap = KeyValueMap,
> = Omit<BaseAppSDK<InstallationParameters, InstanceParameters, never>, 'ids'> &
  SharedEditorSDK & {
    /** A set of IDs for the app */
    ids: Omit<IdsAPI, 'field'>
  }

export type SidebarAppSDK<
  InstallationParameters extends KeyValueMap = KeyValueMap,
  InstanceParameters extends KeyValueMap = KeyValueMap,
> = Omit<BaseAppSDK<InstallationParameters, InstanceParameters, never>, 'ids'> &
  SharedEditorSDK & {
    /** A set of IDs for the app */
    ids: Omit<IdsAPI, 'field'>
    /** Methods to update the size of the iframe the app is contained within.  */
    window: WindowAPI
  }

export type FieldAppSDK<
  InstallationParameters extends KeyValueMap = KeyValueMap,
  InstanceParameters extends KeyValueMap = KeyValueMap,
> = BaseAppSDK<InstallationParameters, InstanceParameters, never> &
  SharedEditorSDK & {
    /** A set of IDs for the app */
    ids: IdsAPI
    /** Gives you access to the value and metadata of the field the app is attached to. */
    field: FieldAPI
    /** Methods to update the size of the iframe the app is contained within.  */
    window: WindowAPI
  }

export type DialogAppSDK<
  InstallationParameters extends KeyValueMap = KeyValueMap,
  InvocationParameters extends SerializedJSONValue = SerializedJSONValue,
> = Omit<BaseAppSDK<InstallationParameters, never, InvocationParameters>, 'ids'> & {
  /** A set of IDs for the app */
  ids: Omit<IdsAPI, EntryScopedIds>
  /** Closes the dialog and resolves openCurrentApp promise with data */
  close: (data?: any) => void
  /** Methods to update the size of the iframe the app is contained within.  */
  window: WindowAPI
}

export type PageAppSDK<InstallationParameters extends KeyValueMap = KeyValueMap> = Omit<
  BaseAppSDK<InstallationParameters, never, { path: string }>,
  'ids'
> & {
  /** A set of IDs actual for the app */
  ids: Omit<IdsAPI, EntryScopedIds>
}

export type HomeAppSDK<InstallationParameters extends KeyValueMap = KeyValueMap> = Omit<
  BaseAppSDK<InstallationParameters, never, never>,
  'ids'
> & {
  ids: Omit<IdsAPI, EntryScopedIds>
}

export type ConfigAppSDK<InstallationParameters extends KeyValueMap = KeyValueMap> = Omit<
  BaseAppSDK<InstallationParameters, never, never>,
  'ids'
> & {
  /** A set of IDs actual for the app */
  ids: Omit<IdsAPI, EntryScopedIds | 'extension' | 'app'> & { app: string }
  app: AppConfigAPI
}

export type KnownAppSDK<
  InstallationParameters extends KeyValueMap = KeyValueMap,
  InstanceParameters extends KeyValueMap = KeyValueMap,
  InvocationParameters extends SerializedJSONValue = SerializedJSONValue,
> =
  | FieldAppSDK<InstallationParameters, InstanceParameters>
  | SidebarAppSDK<InstallationParameters, InstanceParameters>
  | DialogAppSDK<InstallationParameters, InvocationParameters>
  | EditorAppSDK<InstallationParameters, InstanceParameters>
  | PageAppSDK<InstallationParameters>
  | ConfigAppSDK<InstallationParameters>
  | HomeAppSDK<InstallationParameters>

/** @deprecated consider using {@link BaseAppSDK} */
export type BaseExtensionSDK = BaseAppSDK

/** @deprecated consider using {@link EditorAppSDK} */
export type EditorExtensionSDK = EditorAppSDK

/** @deprecated consider using {@link SidebarAppSDK} */
export type SidebarExtensionSDK = SidebarAppSDK

/** @deprecated consider using {@link FieldAppSDK} */
export type FieldExtensionSDK = FieldAppSDK

/** @deprecated consider using {@link DialogAppSDK} */
export type DialogExtensionSDK = DialogAppSDK

/** @deprecated consider using {@link PageAppSDK} */
export type PageExtensionSDK = PageAppSDK

/** @deprecated consider using {@link HomeAppSDK} */
export type HomeExtensionSDK = HomeAppSDK

/** @deprecated consider using {@link ConfigAppSDK} */
export type AppExtensionSDK = ConfigAppSDK

/** @deprecated consider using {@link KnownAppSDK} */
export type KnownSDK = KnownAppSDK

export interface Locations {
  LOCATION_ENTRY_FIELD: 'entry-field'
  LOCATION_ENTRY_FIELD_SIDEBAR: 'entry-field-sidebar'
  LOCATION_ENTRY_SIDEBAR: 'entry-sidebar'
  LOCATION_ASSET_SIDEBAR: 'asset-sidebar'
  LOCATION_DIALOG: 'dialog'
  LOCATION_ENTRY_EDITOR: 'entry-editor'
  LOCATION_PAGE: 'page'
  LOCATION_HOME: 'home'
  LOCATION_APP_CONFIG: 'app-config'
}

export interface ConnectMessage {
  id: string
  location: Location[keyof Location]
  parameters: ParametersAPI<KeyValueMap, KeyValueMap, never>
  locales: LocalesAPI
  user: UserAPI
  initialContentTypes: ContentType[]
  ids: IdsAPI
  contentType: ContentTypeAPI
  editorInterface?: EditorInterface
  editor?: {
    localeSettings: EditorLocaleSettings
    showHiddenFields: boolean
  }
  entry: {
    sys: EntrySys
    metadata?: Metadata
  }
  fieldInfo: EntryFieldInfo[]
  field?: FieldInfo
  hostnames: HostnamesAPI
  release?: Release
  uiLanguageLocale: string
}
