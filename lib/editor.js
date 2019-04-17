const { MemoizedSignal } = require('./signal')

module.exports = function createEditor (channel, editorInterface) {
  const _activeLocalesSygnal = new MemoizedSignal(undefined)
  const _focusedLocaleSygnal = new MemoizedSignal(undefined)
  const _localeModeSygnal = new MemoizedSignal(undefined)
  const _showDisabledFieldsSygnal = new MemoizedSignal(undefined)

  channel.addHandler('activeLocalesChanged', (activeLocales) => {
    _activeLocalesSygnal.dispatch(activeLocales)
  })

  channel.addHandler('focusedLocaleChanged', (focusedLocale) => {
    _focusedLocaleSygnal.dispatch(focusedLocale)
  })

  channel.addHandler('localeModeChanged', (localeMode) => {
    _localeModeSygnal.dispatch(localeMode)
  })

  channel.addHandler('showDisabledFieldsChanged', (showDisabledFields) => {
    _showDisabledFieldsSygnal.dispatch(showDisabledFields)
  })

  return {
    editorInterface,
    onActiveLocalesChanged: (handler) => {
      return _activeLocalesSygnal.attach(handler)
    },
    onFocusedLocaleChanged: (handler) => {
      return _focusedLocaleSygnal.attach(handler)
    },
    onLocaleModeChanged: (handler) => {
      return _localeModeSygnal.attach(handler)
    },
    onShowDisabledFieldsChanged: (handler) => {
      return _showDisabledFieldsSygnal.attach(handler)
    }
  }
}
