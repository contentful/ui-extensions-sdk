const { MemoizedSignal } = require('./signal')

module.exports = function createEditor(channel, editorInterface) {
  const _localeSettingsSygnal = new MemoizedSignal(undefined)
  const _showDisabledFieldsSygnal = new MemoizedSignal(undefined)

  channel.addHandler('localeSettingsChanged', settings => {
    _localeSettingsSygnal.dispatch(settings)
  })

  channel.addHandler('showDisabledFieldsChanged', showDisabledFields => {
    _showDisabledFieldsSygnal.dispatch(showDisabledFields)
  })

  return {
    editorInterface,
    onLocaleSettingsChanged: handler => {
      return _localeSettingsSygnal.attach(handler)
    },
    onShowDisabledFieldsChanged: handler => {
      return _showDisabledFieldsSygnal.attach(handler)
    }
  }
}
