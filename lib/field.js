const FieldLocale = require('./field-locale')

module.exports = class Field {
  constructor (channel, info, defaultLocale) {
    this.id = info.id
    this.locales = info.locales
    this.type = info.type
    this.validations = info.validations
    this._defaultLocale = defaultLocale
    this._fieldLocales = {}

    this.locales.forEach((locale) => {
      const value = info.values[locale]
      this._fieldLocales[locale] =
        new FieldLocale(channel, { id: this.id, locale, value })
    })

    assertHasLocale(this, defaultLocale)
  }

  getValue (locale) {
    return this._getFieldLocale(locale).getValue()
  }

  setValue (value, locale) {
    return this._getFieldLocale(locale).setValue(value)
  }

  removeValue (locale) {
    return this.setValue(undefined, locale)
  }

  onValueChanged (locale, handler) {
    if (!handler) {
      handler = locale
      locale = undefined
    }
    return this._getFieldLocale(locale).onValueChanged(handler)
  }

  onIsDisabledChanged (locale, handler) {
    if (!handler) {
      handler = locale
      locale = undefined
    }

    return this._getFieldLocale(locale).onIsDisabledChanged(handler)
  }

  _getFieldLocale (locale) {
    locale = locale || this._defaultLocale
    assertHasLocale(this, locale)
    return this._fieldLocales[locale]
  }
}

function assertHasLocale (field, locale) {
  if (!field._fieldLocales[locale]) {
    throw new Error(`Unknown locale "${locale}" for field "${field.id}"`)
  }
}
