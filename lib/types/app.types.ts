import { ContentType, KeyValueMap } from './entities'

interface AppStateEditorInterfaceItem {
  controls?: Array<{ fieldId: string; settings?: Record<string, any> }>
  sidebar?: { position: number; settings?: Record<string, any> }
  editors?: { position: number; settings?: Record<string, any> }
}

export interface AppState {
  EditorInterface: Record<ContentType['sys']['id'], AppStateEditorInterfaceItem>
}

export type OnConfigureHandlerReturn<InstallationParameters extends KeyValueMap> =
  | { parameters?: InstallationParameters | null; targetState?: AppState | null }
  | false
export type OnConfigureHandler<InstallationParameters extends KeyValueMap> = () =>
  | OnConfigureHandlerReturn<InstallationParameters>
  | Promise<OnConfigureHandlerReturn<InstallationParameters>>

export interface AppConfigAPI<InstallationParameters extends KeyValueMap> {
  /** Tells the web app that the app is loaded */
  setReady: () => Promise<void>
  /** Returns true if an App is installed */
  isInstalled: () => Promise<boolean>
  /** Returns current state of an App */
  getCurrentState: () => Promise<AppState | null>
  /** Returns parameters of an App, null otherwise */
  getParameters: () => Promise<null | InstallationParameters>
  /** Registers a handler to be called to produce parameters for an App */
  onConfigure: (handler: OnConfigureHandler<InstallationParameters>) => void
  /** Registers a handler to be called once configuration was finished */
  onConfigurationCompleted: (handler: (err: null | { message: string }) => void) => void
}
