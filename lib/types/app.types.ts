import { ContentType, KeyValueMap } from './entities'

interface AppStateEditorInterfaceItem {
  controls?: Array<{ fieldId: string; settings?: Record<string, any> }>
  sidebar?: { position: number; settings?: Record<string, any> }
  editors?: { position: number; settings?: Record<string, any> }
  /**
   * @deprecated use `editors` instead
   */
  editor?: boolean
}

export interface AppState {
  EditorInterface: Record<ContentType['sys']['id'], AppStateEditorInterfaceItem>
}

export interface AppConfigAPI {
  /** Tells the web app that the app is loaded */
  setReady: () => Promise<void>
  /** Returns true if an App is installed */
  isInstalled: () => Promise<boolean>
  /** Returns current state of an App */
  getCurrentState: () => Promise<AppState | null>
  /** Returns parameters of an App, null otherwise */
  getParameters: <T extends KeyValueMap = KeyValueMap>() => Promise<null | T>
  /** Registers a handler to be called to produce parameters for an App */
  onConfigure: (
    handler: () =>
      | Promise<{ parameters?: KeyValueMap; targetState?: AppState }>
      | { parameters?: KeyValueMap; targetState?: AppState }
      | false
  ) => void
  /** Registers a handler to be called once configuration was finished */
  onConfigurationCompleted: (handler: (err: null | { message: string }) => void) => void
}
