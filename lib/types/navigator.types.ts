import { Asset, Entry, KeyValueMap } from './entities'

export interface NavigatorAPIOptions {
  /** use `waitForClose` if you want promise to be resolved only after slide in editor is closed */
  slideIn?: boolean | { waitForClose: boolean }
  /** if provided, the entry will be opened in the release context with the given release id */
  releaseId?: string
}

export interface PageExtensionOptions {
  /** If included, you can navigate to a different page extension. If omitted, you will navigate within the current extension. */
  id?: string
  /** Navigate to a path within your page extension. */
  path?: string
  /**
   * Replace the current browser history entry instead of pushing a new one. Use this when
   * your app has already pushed its own history entry for this navigation, for example
   * through a client-side router, so that going back does not step through a duplicate
   * entry. Hosts that do not support this option push a new entry. Defaults to `false`.
   */
  replace?: boolean
}

export interface AppPageLocationOptions {
  /** A path to navigate to within your app's page location. */
  path?: string
  /**
   * Replace the current browser history entry instead of pushing a new one. Use this when
   * your app has already pushed its own history entry for this navigation, for example
   * through a client-side router, so that going back does not step through a duplicate
   * entry. Hosts that do not support this option push a new entry. Defaults to `false`.
   */
  replace?: boolean
}

/** Information about current value of the navigation status. */
export interface NavigatorPageResponse {
  /** Will be true if navigation was successfully executed by the web app. */
  navigated: boolean
  /** The path that was navigated to by the web app. */
  path: string
}

export interface NavigatorSlideInfo {
  newSlideLevel: number
  oldSlideLevel: number
}

export interface NavigatorPageLocation {
  /** The path the host navigated to, relative to the app's page location root. */
  path: string
}

export interface NavigatorOpenResponse<T> {
  navigated: boolean
  entity?: T
  slide?: NavigatorSlideInfo
}

export interface NavigatorAPI {
  /** Opens an existing entry in the current Web App session. */
  openEntry: <Fields extends KeyValueMap = KeyValueMap>(
    entryId: string,
    options?: NavigatorAPIOptions,
  ) => Promise<NavigatorOpenResponse<Entry<Fields>>>
  /** Opens an existing asset in the current Web App session. */
  openAsset: (
    assetId: string,
    options?: NavigatorAPIOptions,
  ) => Promise<NavigatorOpenResponse<Asset>>
  /** Opens a new entry in the current Web App session. */
  openNewEntry: <Fields extends KeyValueMap = KeyValueMap>(
    contentTypeId: string,
    options?: NavigatorAPIOptions,
  ) => Promise<NavigatorOpenResponse<Entry<Fields>>>
  /** Opens a new asset in the current Web App session. */
  openNewAsset: (options?: NavigatorAPIOptions) => Promise<NavigatorOpenResponse<Asset>>
  /** Navigates to a page extension in the current Web App session. Calling without `options` will navigate to the home route of your page extension. */
  openPageExtension: (options?: PageExtensionOptions) => Promise<NavigatorPageResponse>
  /** Navigates to the app's page location. */
  openCurrentAppPage: (options?: AppPageLocationOptions) => Promise<NavigatorPageResponse>
  /** Navigates to a bulk entry editor */
  openBulkEditor: (
    entryId: string,
    options: {
      /** ID of the reference field */
      fieldId: string
      /** Editable locale */
      locale: string
      /** Focused index */
      index: number
    },
  ) => Promise<{
    navigated: boolean
    slide?: NavigatorSlideInfo
  }>
  openAppConfig: () => Promise<void>
  openEntriesList: (options?: Pick<NavigatorAPIOptions, 'releaseId'>) => Promise<void>
  openAssetsList: (options?: Pick<NavigatorAPIOptions, 'releaseId'>) => Promise<void>
  /**
   * Opens an existing Experience in the Experience Canvas (full-page).
   * When the SDK session has an active release, navigation preserves that release context
   * (same ambient model as `openEntry` / `openEntriesList`).
   */
  openExperience: (experienceId: string) => Promise<void>
  /** Opens an existing Component in the Component Canvas (full-page). */
  openComponent: (componentId: string) => Promise<void>
  onSlideInNavigation: (fn: (slide: NavigatorSlideInfo) => void) => () => void
  /**
   * Subscribes to the host navigating the app's page location to a new path.
   *
   * The handler is called on subscribe with the current location, then again on
   * every subsequent host navigation.
   *
   * Returns a function that unsubscribes.
   */
  onPathChange: (fn: (location: NavigatorPageLocation) => void) => () => void
}
