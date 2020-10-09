import { EditorInterface } from '../typings'
import { Channel } from './channel'
import { MemoizedSignal } from './signal'

export default function createEditor(channel: Channel, editorInterface: EditorInterface) {
  const _localeSettingsSygnal = new MemoizedSignal(undefined)
  const _showDisabledFieldsSygnal = new MemoizedSignal(undefined)

  // TODO any
  channel.addHandler('localeSettingsChanged', (settings: any) => {
    _localeSettingsSygnal.dispatch(settings)
  })

  channel.addHandler('showDisabledFieldsChanged', (showDisabledFields: boolean) => {
    _showDisabledFieldsSygnal.dispatch(showDisabledFields)
  })

  return {
    editorInterface,
    onLocaleSettingsChanged: (handler: Function) => {
      return _localeSettingsSygnal.attach(handler)
    },
    onShowDisabledFieldsChanged: (handler: Function) => {
      return _showDisabledFieldsSygnal.attach(handler)
    }
  }
}
