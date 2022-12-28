import { EditorInterface, EditorLocaleSettings, SharedEditorSDK } from './types'
import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { ConnectMessage } from './types/api.types'

export default function createEditor(
  channel: Channel,
  editorData: Exclude<ConnectMessage['editor'], undefined>,
  editorInterface: EditorInterface
): SharedEditorSDK['editor'] {
  const localeSettingsSignal = new MemoizedSignal<[EditorLocaleSettings]>(editorData.localeSettings)
  const showDisabledFieldsSignal = new MemoizedSignal<[boolean]>(editorData.showDisabledFields)

  channel.addHandler('localeSettingsChanged', (settings: EditorLocaleSettings) => {
    localeSettingsSignal.dispatch(settings)
  })

  channel.addHandler('showDisabledFieldsChanged', (showDisabledFields: boolean) => {
    showDisabledFieldsSignal.dispatch(showDisabledFields)
  })

  return {
    editorInterface,
    onLocaleSettingsChanged: (handler: (localeSettings: EditorLocaleSettings) => void) => {
      return localeSettingsSignal.attach(handler)
    },
    onShowDisabledFieldsChanged: (handler: (showDisabledFields: boolean) => void) => {
      return showDisabledFieldsSignal.attach(handler)
    },
  }
}
