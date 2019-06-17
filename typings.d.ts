declare module 'contentful-ui-extensions-sdk' {

  interface SpaceMembership {
    sys: {
      id: string;
      type: string;
    };
    admin: boolean;
    roles: { name: string; description: string }[];
  }

  interface User {
    sys: {
      id: string;
      type: string;
    };
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    spaceMembership: SpaceMembership;
  }

  interface Items {
    type: string;
    linkType?: string;
    validations?: Object[];
  }

    /* Field API */

  interface FieldAPI  {
    /** The ID of a field is defined in an entry's content type. */
    id: string;
    /** The current locale of a field the extension is attached to. */
    locale: string;
    /** Holds the type of the field the extension is attached to. */
    type: string;
    /** Indicates if a value for this field is required **/
    required: boolean;
    /** A list of validations for this field that are defined in the content type. */
    validations: Object[];
    /** Defines the shape of array items **/
    items?: Items;

    /** Gets the current value of the field and locale. */
    getValue: () => any;
    /** Sets the value for the field and locale.  */
    setValue: (value: any) => Promise<any>;
    /** Removes the value for the field and locale. */
    removeValue: () => Promise<void>;
    /** Communicates to the web application if the field is in a valid state or not. */
    setInvalid: (value: boolean) => void;

    /** Calls the callback every time the value of the field is changed by an external event or when setValue() is called. */
    onValueChanged: (callback: (value: any) => void) => Function;
    /** Calls the callback when the disabled status of the field changes. */
    onIsDisabledChanged: (callback: Function) => Function;
    /** Calls the callback immediately with the current validation errors and whenever the field is re-validated. */
    onSchemaErrorsChanged: (callback: Function) => Function;
  }

  /* Entry API */


  type onValueChangedType = (callback: (value: any) => void) => Function;
  type onValueChangeWithLocaleType = (locale: string, callback: (value: any) => void) => Function;
  type onIsDisabledChangedType = (callback: Function) => Function;
  type onIsDisabledChangedWithLocaleType = (locale: string, callback: Function) => Function;

  interface EntryFieldAPI {
    /** The ID of a field is defined in an entry's content type. */
    id: string;
    /** The list of locales for the field. */
    locales: string[];
     /** Holds the type of the field. */
    type: string;
    /** Indicates if a value for this field is required **/
    required: boolean;
    /** A list of validations for this field that are defined in the content type. */
    validations: Object[];
    /** Defines the shape of array items **/
    items?: Items;

    /** Gets the current value of the field and locale. */
    getValue: (locale?: string) => any;
    /** Sets the value for the field and locale.  */
    setValue: (value: any, locale?: string) => Promise<any>;
    /** Removes the value for the field and locale. */
    removeValue: (locale?: string) => Promise<void>;
    /** Calls the callback every time the value of the field is changed by an external event or when setValue() is called. */
    onValueChanged: onValueChangedType | onValueChangeWithLocaleType;
    /** Calls the callback when the disabled status of the field changes. */
    onIsDisabledChanged: onIsDisabledChangedType | onIsDisabledChangedWithLocaleType;
  }

  interface EntryAPI {
    /** Returns metadata for an entry. */
    getSys: () => Object;
    /** Calls the callback with metadata every time that metadata changes. */
    onSysChanged: (callback: (sys: Object) => void) => Function;
    /** Allows to control the values of all other fields in the current entry. */
    fields: { [key: string]: EntryFieldAPI }
  }

  /* Content Type API */

  interface ContentTypeField {
    disabled: boolean;
    id: string;
    localized: boolean;
    name: string;
    omitted: boolean;
    required: boolean;
    type: string;
    validations: Object[];
    linkType?: string;
    items?: Items;
  }

  interface Link {
    sys: {
      id: string;
      type: string;
      linkType: string;
    };
  }

  interface ContentType {
    sys: {
      type: string;
      id: string;
      version?: number;
      space?: Link;
      environment?: Link;
      createdAt?: string;
      createdBy?: Link;
      updatedAt?: string;
      updatedBy?: Link;
    };
    fields: { [key: string]: ContentTypeField };
    name: string;
    displayField: string;
    description: string;
  }

  interface EditorInterface {
    sys: Object;
    controls?: Array<{
      fieldId: string;
      widgetId?: string;
      widgetNamespace?: string;
      settings?: Object;
    }>;
    sidebar?: Array<{
      widgetId: string;
      widgetNamespace: string;
      settings?: Object;
      disabled?: boolean;
    }>;
    editor?: {
      widgetId: string;
      widgetNamespace: string;
      settings?: Object;
    }
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

    /** Returns all users who belong to the space. */
    getUsers: () => Promise<CollectionReponse<Object>>,

    /** Returns editor interface for a given content type */
    getEditorInterface: (contentTypeId: string) => Promise<EditorInterface>
  }

  /* Locales API */

  interface LocalesAPI {
    /** The default locale code for the current space. */
    default: string;
    /** A list of locale codes of all locales available for editing in the current space. */
    available: string[];
    /** An object with keys of locale codes and values of corresponding human-readable locale names. */
    names: { [key:string]: string }
  }

  /* Window API */

  interface WindowAPI {
    /** Sets the iframe height to the given value in pixels or using scrollHeight if value is not passed */
    updateHeight: (height?: number) => void;
    /** Listens for DOM changes and updates height when the size changes. */
    startAutoResizer: () => void;
    /** Stops resizing the iframe automatically. */
    stopAutoResizer: () => void;
  }

  /* Dialogs API */

  interface OpenAlertOptions {
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

  interface OpenExtensionOptions {
    id: string;
    width?: number;
    position?: 'center' | 'top';
    title?: string;
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEscapePress?: boolean;
    parameters?: Object;
  }

  interface DialogsAPI {
    /** Opens a simple alert window (which can only be closed). */
    openAlert: (options: OpenAlertOptions) => Promise<boolean>;
    /** Opens a confirmation window. A user can either confirm or cancel the dialog. */
    openConfirm: (options: OpenConfirmOptions) => Promise<boolean>;
    /** Opens a prompt window. A user can either provide a string input or cancel the dialog. */
    openPrompt: (options: OpenConfirmOptions & {
      defaultValue?: string;
    }) => Promise<string | boolean>;
    /** Opens an extension in a dialog. */
    openExtension: (options: OpenExtensionOptions) => Promise<any>;
    /** Opens a dialog for selecting a single entry. */
    selectSingleEntry: (options?: {
      locale?: string;
      contentTypes?: string[];
    }) => Promise<Object | null>;
    /** Opens a dialog for selecting multiple entries. */
    selectMultipleEntries: (options?: {
      locale?: string;
      contentTypes?: string[];
      min?: number;
      max?: number;
    }) => Promise<Object[] | null>;
    /** Opens a dialog for selecting a single asset. */
    selectSingleAsset: (options?: {
      locale?: string;
    }) => Promise<Object | null>;
    /** Opens a dialog for selecting multiple assets. */
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

    interface PageExtensionOptions {
        extensionId?: string;
        path?: string;
    }

  interface NavigatorAPI {
    /** Opens an existing entry in the current Web App session. */
    openEntry: (entryId: string, options?: NavigatorAPIOptions) => Promise<void>;
    /** Opens an existing asset in the current Web App session. */
    openAsset: (assetId: string, options?: NavigatorAPIOptions) => Promise<void>;
    /** Opens a new entry in the current Web App session. */
    openNewEntry: (contentTypeId: string, options?: NavigatorAPIOptions) => Promise<void>;
    /** Opens a new asset in the current Web App session. */
    openNewAsset: (options: NavigatorAPIOptions) => Promise<void>;
    openPageExtension: (options?: PageExtensionOptions) => Promise<void>;
  }

  /* Notifier API */

  interface NotifierAPI {
    /** Displays a success notification in the notification area of the Web App. */
    success: (message: string) => void;
    /** Displays an error notification in the notification area of the Web App. */
    error: (message: string) => void;
  }

  /* Location API */

  interface LocationAPI {
    /** Checks the location in which your extension is running */
    is: (type: string) => boolean;
  }

  /* Parameters API */

  interface ParametersAPI {
    installation: Object;
    instance: Object;
    invocation?: Object;
  }

  /* IDs */

  interface IdsAPI {
    user: string;
    extension: string;
    space: string;
    environment: string;
    field: string;
    entry: string;
    contentType: string;
  }

  interface SharedEditorSDK {
    editor: {
      editorInterface: EditorInterface,
      onLocaleSettingsChanged: (callback: (value: { mode: 'multi' | 'single', focused?: string, active?: Array<string>} ) => any) => Function;
      onShowDisabledFieldsChanged: (callback: (value: boolean) => any) => Function;
    }
  }

  export interface BaseExtensionSDK {
    /** Allows to read and update the value of any field of the current entry and to get the entry's metadata */
    entry: EntryAPI;
    /** Information about the content type of the entry. */
    contentType: ContentType;
    /** Exposes methods that allow the extension to read and manipulate a wide range of objects in the space. */
    space: SpaceAPI;
    /** Information about the current user and roles */
    user: User;
    /** Information about the current locales */
    locales: LocalesAPI;
    /** Methods for opening UI dialogs: */
    dialogs: DialogsAPI;
    /** Methods for navigating between entities stored in a Contentful space. */
    navigator: NavigatorAPI;
    /** Methods for displaying notifications. */
    notifier: NotifierAPI;
    /** Exposes extension configuration parameters */
    parameters: ParametersAPI;
    /** Exposes method to identify extension's location */
    location: LocationAPI;
  }

  export type EditorExtensionSDK = BaseExtensionSDK & SharedEditorSDK & {
    /** A set of IDs actual for the extension */
    ids: Pick<IdsAPI, 'entry' | 'contentType' | 'environment' | 'space' | 'extension' | 'user'>;
  };

  export type SidebarExtensionSDK = BaseExtensionSDK & SharedEditorSDK & {
    /** A set of IDs actual for the extension */
    ids: Pick<IdsAPI, 'entry' | 'contentType' | 'environment' | 'space' | 'extension' | 'user'>;
    /** Methods to update the size of the iframe the extension is contained within.  */
    window: WindowAPI;
  };

  export type FieldExtensionSDK = BaseExtensionSDK & SharedEditorSDK & {
    /** A set of IDs actual for the extension */
    ids: IdsAPI;
    /** Gives you access to the value and metadata of the field the extension is attached to. */
    field: FieldAPI;
    /** Methods to update the size of the iframe the extension is contained within.  */
    window: WindowAPI;
  }

  export type DialogExtensionSDK = BaseExtensionSDK & {
    /** A set of IDs actual for the extension */
    ids: Pick<IdsAPI, 'environment' | 'space' | 'extension' | 'user'>;
    /** Closes the dialog and resolves openExtension promise with data */
    close: (data: any) => void
    /** Methods to update the size of the iframe the extension is contained within.  */
    window: WindowAPI;
  }

  export const init: (initCallback: (sdk: FieldExtensionSDK | SidebarExtensionSDK | DialogExtensionSDK | EditorExtensionSDK) => any) => void;

  export const locations: {
    LOCATION_ENTRY_FIELD: string;
    LOCATION_ENTRY_FIELD_SIDEBAR: string;
    LOCATION_ENTRY_SIDEBAR: string;
    LOCATION_DIALOG: string;
    LOCATION_ENTRY_EDITOR: string;
    LOCATION_PAGE: string;
  }

}
