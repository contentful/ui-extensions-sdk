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

    assertHasLocale(this, defaultLocale)

    channel.addHandler('valueChanged', (id, locale, value) => {
      if (id !== this.id) {
        return
      }

      const locales = locale ? [locale] : this.locales
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
    assertHasLocale(this, locale)
    this._values[locale] = value
    return this._channel.call('setValue', this.id, locale, value)
  }

  removeValue (locale) {
    return this.setValue(undefined, locale)
  }

  onValueChanged (locale, handler) {
    if (!handler) {
      handler = locale
      locale = this._defaultLocale
    }
    assertHasLocale(this, locale)
    return this._valueSignals[locale].attach(handler)
  }

}

function assertHasLocale (instance, locale) {
  if (!instance._valueSignals[locale]) {
    throw new UnknownLocaleError(instance.id, locale)
  }
}

export class UnknownLocaleError extends Error {
  constructor (fieldId, locale) {
    super()
    this.message = `Unknown locale "${locale}" for field "${fieldId}"`
    this.fieldId = fieldId
    this.locale = locale
  }
}
