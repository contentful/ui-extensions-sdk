import { EditorInterface, EditorLocaleSettings, SharedEditorSDK } from './types'
import { Channel } from './channel'
import { MemoizedSignal } from './signal'

export default function createEditor(
  channel: Channel,
  editorInterface: EditorInterface
): SharedEditorSDK['editor'] {
  // @ts-expect-error Missing default value
  const _localeSettingsSygnal = new MemoizedSignal<[EditorLocaleSettings]>([undefined])
  // @ts-expect-error Missing default value
  const _showDisabledFieldsSygnal = new MemoizedSignal<[boolean]>([undefined])

  channel.addHandler('localeSettingsChanged', (settings: EditorLocaleSettings) => {
    _localeSettingsSygnal.dispatch(settings)
  })

  channel.addHandler('showDisabledFieldsChanged', (showDisabledFields: boolean) => {
    _showDisabledFieldsSygnal.dispatch(showDisabledFields)
  })

  return {
    editorInterface,
    onLocaleSettingsChanged: (handler: (localeSettings: EditorLocaleSettings) => void) => {
      return _localeSettingsSygnal.attach(handler)
    },
    onShowDisabledFieldsChanged: (handler: (showDisabledFields: boolean) => void) => {
      return _showDisabledFieldsSygnal.attach(handler)
    },
  }
}
