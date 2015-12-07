import Signal from './signal'

export default class Field {

  constructor (channel, info, defaultLocale) {
    this.id = info.id
    this.locales = info.locales
    this._defaultLocale = defaultLocale
    this._valueSignals = {}
    this._values = info.values
    this._channel = channel

    this.locales.forEach((locale) => {
      this._valueSignals[locale] = new Signal()
    })

    channel.addHandler('valueChanged', (id, locale, value) => {
      if (id !== this.id) {
        return
      }

      var locales = locale ? [locale] : this.locales
      locales.forEach((locale) => {
        this._values[locale] = value
        this._valueSignals[locale].dispatch(value)
      })
    })
  }

  getValue (locale) {
    locale = locale || this._defaultLocale
    return this._values[locale]
  }

  setValue (value, locale) {
    locale = locale || this._defaultLocale
    this._values[locale] = value
    return this._channel.call('setValue', this.id, locale, value)
  }

  removeValue (locale) {
    this.setValue(undefined, locale)
  }

  onValueChanged (locale, handler) {
    if (!handler) {
      handler = locale
      locale = this._defaultLocale
    }
    if (!(locale in this._valueSignals)) {
      throw new Error(`Unknown locale "${locale}" for field "${this.id}"`)
    }
    return this._valueSignals[locale].attach(handler)
  }

}
