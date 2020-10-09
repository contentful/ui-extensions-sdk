import { Channel } from './channel'
import FieldLocale from './field-locale'
import { EntryFieldAPI, EntryFieldInfo, Items } from './types'

export default class Field implements EntryFieldAPI {
  private _defaultLocale: string
  private _fieldLocales: { [key: string]: FieldLocale }
  id: string
  locales: string[]
  type: string
  required: boolean
  validations: Object[]
  items?: Items

  constructor(channel: Channel, info: EntryFieldInfo, defaultLocale: string) {
    this.id = info.id
    this.locales = info.locales
    this.type = info.type
    this.required = info.required
    this.validations = info.validations
    this.items = info.items

    this._defaultLocale = defaultLocale

    this._fieldLocales = info.locales.reduce(
      (acc: { [key: string]: FieldLocale }, locale: string) => {
        const fieldLocale = new FieldLocale(channel, {
          id: info.id,
          type: info.type,
          required: info.required,
          validations: info.validations,
          items: info.items,
          locale,
          value: info.values[locale]
        })

        return { ...acc, [locale]: fieldLocale }
      },
      {}
    )

    this.assertHasLocale(defaultLocale)
  }

  getValue(locale?: string) {
    return this._getFieldLocale(locale).getValue()
  }

  setValue(value: any, locale?: string) {
    return this._getFieldLocale(locale).setValue(value)
  }

  removeValue(locale?: string) {
    return this.setValue(undefined, locale)
  }

  // TODO swap argument positions to get rid of swap logic (breaking change)
  onValueChanged(locale: string | Function, handler?: Function) {
    const h = handler || locale
    if (!handler) {
      locale = ''
    }
    return this._getFieldLocale(locale as string).onValueChanged(h as any)
  }

  // TODO swap argument positions to get rid of swap logic (breaking change)
  onIsDisabledChanged(locale: string | Function, handler?: Function) {
    const h = handler || locale
    if (!handler) {
      locale = ''
    }

    return this._getFieldLocale(locale as string).onIsDisabledChanged(h as any)
  }

  private _getFieldLocale(locale?: string) {
    locale = locale || this._defaultLocale
    this.assertHasLocale(locale)
    return this._fieldLocales[locale]
  }

  getForLocale(locale: string) {
    if (!locale) {
      throw new Error('getForLocale must be passed a locale')
    }

    return this._getFieldLocale(locale)
  }

  assertHasLocale(locale: string) {
    if (!this._fieldLocales[locale]) {
      throw new Error(`Unknown locale "${locale}" for field "${this.id}"`)
    }
  }
}
