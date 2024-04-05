import { EditorInterface, EditorLocaleSettings, SharedEditorSDK } from './types'
import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { ConnectMessage } from './types/api.types'

export default function createEditor(
  channel: Channel,
  editorInterface: EditorInterface,
  editorData: Exclude<ConnectMessage['editor'], undefined>,
): SharedEditorSDK['editor'] {
  const localeSettingsSignal = new MemoizedSignal<[EditorLocaleSettings]>(editorData.localeSettings)
  const showHiddenFieldsSignal = new MemoizedSignal<[boolean]>(editorData.showHiddenFields)

  channel.addHandler('localeSettingsChanged', (settings: EditorLocaleSettings) => {
    localeSettingsSignal.dispatch(settings)
  })

  channel.addHandler('showHiddenFieldsChanged', (showHiddenFields: boolean) => {
    showHiddenFieldsSignal.dispatch(showHiddenFields)
  })

  return {
    editorInterface,
    getLocaleSettings(): EditorLocaleSettings {
      return localeSettingsSignal.getMemoizedArgs()[0]
    },
    onLocaleSettingsChanged: (handler) => {
      return localeSettingsSignal.attach(handler)
    },
    /**
     * @deprecated
     */
    onShowDisabledFieldsChanged: (handler) => {
      return showHiddenFieldsSignal.attach(handler)
    },
    getShowHiddenFields(): boolean {
      return showHiddenFieldsSignal.getMemoizedArgs()[0]
    },
    onShowHiddenFieldsChanged: (handler) => {
      return showHiddenFieldsSignal.attach(handler)
    },
  }
}
