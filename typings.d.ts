declare module 'contentful-ui-extensions-sdk' {

  interface Sys {
    id: string;
    type: string;
    linkType?: string;
  }

  interface SpaceMembership {
    sys: Sys;
    admin: boolean;
    roles: { name: string; description: string }[];
  }

  interface ContentTypeSys {
    sys: {
      type: string;
      id: string;
      version?: number;
      space?: {
        sys: Sys;
      };
      environment?: {
        sys: Sys;
      };
      createdAt?: string;
      createdBy?: {
        sys: Sys;
      };
      updatedAt?: string;
      updatedBy?: {
        sys: Sys
      };
      linkType?: string;
    }
  }

  interface User {
    sys: Sys;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    spaceMembership: SpaceMembership;
  }

    /* Field API */

  interface FieldAPI  {

    id: string;
    locale: string;
    type: string;
    validations: Object[];

    getValue: () => any;
    setValue: (value: any) => Promise<any>;
    removeValue: () => Promise<void>;
    setInvalid: (value: boolean) => void;

    onValueChanged: (callback: (value: any) => void) => Function;
    onIsDisabledChanged: (callback: Function) => Function;
    onSchemaErrorsChanged: (callback: Function) => Function;
  }

  /* Entry API */


  type onValueChangedType = (callback: (value: any) => void) => Function;
  type onValueChangeWithLocaleType = (locale: string, callback: (value: any) => void) => Function;
  type onIsDisabledChangedType = (callback: Function) => Function;
  type onIsDisabledChangedWithLocaleType = (locale: string, callback: Function) => Function;

  interface EntryFieldAPI {
    id: string;
    locales: string[];
    type: string;
    validations: Object[];


    getValue: (locale?: string) => any;
    setValue: (value: any, locale?: string) => Promise<any>;
    removeValue: (locale?: string) => Promise<void>;
    onValueChanged: onValueChangedType | onValueChangeWithLocaleType;
    onIsDisabledChanged: onIsDisabledChangedType | onIsDisabledChangedWithLocaleType;
  }

  interface EntryAPI {
    getSys: () => Object;
    onSysChanged: (callback: (sys: Object) => void) => Function;
    fields: { [key: string]: EntryFieldAPI }
  }

  /* Content Type API */

  type ContentTypeField = {
    disabled: boolean;
    id: string;
    localized: boolean;
    name: string;
    omitted: boolean;
    required: boolean;
    type: string;
    validations: Object[];
    linkType?: string;
    items?: Object;
  }

  type ContentTypeAPI = ContentTypeSys & {
    fields: { [key: string]: ContentTypeField };
    name: string;
    displayField: string;
    description: string;
  }

  /* Space API */

  interface SearchQuery {
    order?: string;
    skip?: number;
    limit?: number;
    [key: string]: any;
  }

  type CollectionReponse<T> = {
    items: T[];
    total: number;
    skip: number;
    limit: number;
    sys: { type: string }
  }

  interface SpaceAPI {
    getContentType: (id: string) => Promise<Object>;
    getContentTypes: () => Promise<CollectionReponse<Object>>;
    createContentType: (data: any) => Promise<Object>;
    updateContentType: (data: any) => Promise<Object>;
    deleteContentType: (data: any) => Promise<Object>;

    getEntry: (id: string) => Promise<Object>;
    getEntrySnapshots: (id: string) => Promise<any>;
    getEntries: (query?: SearchQuery) => Promise<CollectionReponse<Object>>;
    createEntry: (contentTypeId: string, data: any) => Promise<Object>;
    updateEntry: (data: any) => Promise<Object>;
    publishEntry: (data: any) => Promise<Object>;
    unpublishEntry: (data: any) => Promise<Object>;
    archiveEntry: (data: any) => Promise<Object>;
    unarchiveEntry: (data: any) => Promise<Object>;
    deleteEntry: (data: any) => Promise<Object>;
    getPublishedEntries: (query?: SearchQuery) => Promise<CollectionReponse<Object>>;

    getAsset: (id: string) => Promise<Object>;
    getAssets: (query?: SearchQuery) => Promise<CollectionReponse<Object>>;
    createAsset: (data: any) => Promise<Object>;
    updateAsset: (data: any) => Promise<Object>;
    deleteAsset: (data: any) => Promise<Object>;
    publishAsset: (data: any) => Promise<Object>;
    unpublishAsset: (data: any) => Promise<Object>;
    archiveAsset: (data: any) => Promise<Object>;
    processAsset: (data: any, locale: string) => Promise<Object>;
    unarchiveAsset: (data: any) => Promise<Object>;
    getPublishedAssets: (query?: SearchQuery) => Promise<CollectionReponse<Object>>;
    createUpload: (base64data: string) => void;
    waitUntilAssetProcessed: (assetId: string, locale: string) => void;

    getUsers: () => Promise<CollectionReponse<Object>>
  }

  /* Locales API */

  interface LocalesAPI {
    default: string;
    available: string[];
    names: { [key:string]: string }
  }

  /* User API */

  type UserAPI = User;

  /* Window API */

  interface WindowAPI {
    updateHeight: (height?: number) => void;
    startAutoResizer: () => void;
    stopAutoResizer: () => void;
  }

  /* Dialogs API */

  type OpenAlertOptions = {
    title: string;
    message: string;
    confirmLabel?: string;
    shouldCloseOnEscapePress?: boolean;
    shouldCloseOnOverlayClick?: boolean;
  }

  type OpenConfirmOptions = OpenAlertOptions & {
    cancelLabel?: string;
    intent?: 'primary' | 'positive' | 'negative'
  }

  type OpenExtensionOptions = {
    id: string;
    width?: number;
    position?: 'center' | 'top';
    title?: string;
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEscapePress?: boolean;
    parameters?: Object;
  }

  interface DialogsAPI {

    openAlert: (options: OpenAlertOptions) => Promise<boolean>;

    openConfirm: (options: OpenConfirmOptions) => Promise<boolean>;

    openPrompt: (options: OpenConfirmOptions & {
      defaultValue?: string;
    }) => Promise<string | boolean>;

    openExtension: (options: OpenExtensionOptions) => Promise<any>;

    selectSingleEntry: (options?: {
      locale?: string;
      contentTypes?: string[];
    }) => Promise<Object | null>;

    selectMultipleEntries: (options?: {
      locale?: string;
      contentTypes?: string[];
      min?: number;
      max?: number;
    }) => Promise<Object[] | null>;

    selectSingleAsset: (options?: {
      locale?: string;
    }) => Promise<Object | null>;

    selectMultipleAssets: (options?: {
      locale?: string;
      min?: number;
      max?: number;
    }) => Promise<Object[] | null>;
  }

  /* Navigator API */

  interface NavigatorAPIOptions {
    slideIn?: boolean;
  }

  interface NavigatorAPI {
    openEntry: (entryId: string, options?: NavigatorAPIOptions) => Promise<void>;
    openAsset: (assetId: string, options?: NavigatorAPIOptions) => Promise<void>;
    openNewEntry: (contentTypeId: string, options?: NavigatorAPIOptions) => Promise<void>;
    openNewAsset: (options: NavigatorAPIOptions) => Promise<void>;
  }

  /* Notifier API */

  interface NotifierAPI {
    success: (message: string) => void;
    error: (message: string) => void;
  }

  /* Location API */

  interface LocationAPI {
    is: (type: string) => boolean;
  }

  /* Parameters API */

  interface ParametersAPI {
    installation: Object;
    instance: Object;
    invocation?: Object;
  }

  export interface ExtensionSDK {
    field?: FieldAPI;
    entry: EntryAPI;
    contentType: ContentTypeAPI;
    space: SpaceAPI;
    locales: LocalesAPI;
    user: UserAPI;
    window: WindowAPI;
    dialogs: DialogsAPI;
    navigator: NavigatorAPI;
    notifier: NotifierAPI;
    parameters: ParametersAPI;
    location: LocationAPI;
  }

  type InitCallback = (sdk: ExtensionSDK) => void;

  export const init: (initCallback: InitCallback) => void;
  export const locations: {
    LOCATION_ENTRY_FIELD: string;
    LOCATION_ENTRY_FIELD_SIDEBAR: string;
    LOCATION_ENTRY_SIDEBAR: string;
    LOCATION_DIALOG: string;
  }

}