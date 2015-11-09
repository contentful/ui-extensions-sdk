import Signal from './signal'

export default class Field {

  constructor (channel, info, defaultLocale) {
    this.id = info.id
    this._locales = info.locales
    this._defaultLocale = defaultLocale
    this._valueSignals = {}
    this._values = info.values
    this._channel = channel

    this._locales.forEach((locale) => {
      this._valueSignals[locale] = new Signal()
    })

    channel.addHandler('valueChanged', (id, locale, value) => {
      if (id === this.id) {
        this._values[locale] = value
        this._valueSignals[locale].dispatch(value)
      }
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
    this.setValue(locale)
  }

  onValueChanged (locale, handler) {
    if (!handler) {
      handler = locale
      locale = this._defaultLocale
    }
    return this._valueSignals[locale].attach(handler)
  }

}
