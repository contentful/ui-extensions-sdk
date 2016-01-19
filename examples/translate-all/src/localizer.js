import yandexTranslator from './yandex-translator'

export default class Localizer {
  constructor () {}

  localize (localizables) {
    const promises = []
    for (let localizable of localizables) {
      const p = this._handleLocalizable(localizable)
      promises.push(p)
    }
    return Promise.all(promises)
  }

  _handleLocalizable (localizable) {
    const {srcValue, valueType} = localizable
    if (
      // TODO: Handle "Array" as well.
      ['Symbol', 'Text'].indexOf(valueType) > -1 &&
      typeof srcValue === 'string'
    ) {
      return this._translateLocale(localizable)
    }
    return this._copyLocale(localizable)
  }

  _translateLocale (localizable) {
    const {locale, srcLocale, srcValue, localize} = localizable
    const sourceLang = localeToLanguage(srcLocale)
    const targetLang = localeToLanguage(locale)
    return yandexTranslator
      .lookup(srcValue, targetLang, sourceLang)
      .then((result) => {
        if (typeof result === 'string') {
          localize(result)
          return result
        } else {
          return this._copyLocale(localizable)
        }
      })
  }

  _copyLocale ({srcValue, localize}) {
    localize(srcValue)
    return Promise.resolve(srcValue)
  }
}

function localeToLanguage (locale) {
  return locale.match(/^[a-z]+/)[0]
}
