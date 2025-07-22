import { Channel } from './channel'
import { makeFieldLocale } from './field-locale'
import { EntryFieldInfo, Items, FieldAPI, FieldLinkType } from './types'
import {
  ArrayEntryFieldAPI,
  ArrayEntryFieldInfo,
  BasicEntryFieldAPI,
  BasicEntryFieldInfo,
  EntryFieldAPI,
  FieldInfo,
  LinkEntryFieldAPI,
  LinkEntryFieldInfo,
} from './types/field.types'

class EntryField {
  private _defaultLocale: string
  private _fieldLocales: { [key: string]: FieldAPI }
  id: string
  name: string
  locales: string[]
  required: boolean
  validations: Object[]

  constructor(channel: Channel, info: EntryFieldInfo, defaultLocale: string) {
    this.id = info.id
    this.name = info.name
    this.locales = info.locales
    this.required = info.required
    this.validations = info.validations
    this._defaultLocale = defaultLocale

    this._fieldLocales = info.locales.reduce((acc: { [key: string]: FieldAPI }, locale: string) => {
      const fieldLocale = makeFieldLocale(channel, this.toFieldInfo(info, locale))
      return { ...acc, [locale]: fieldLocale }
    }, {})

    this.assertHasLocale(defaultLocale)
  }

  getValue(locale?: string) {
    return this._getFieldLocale(locale).getValue()
  }

  async setValue(value: any, locale?: string) {
    return await this._getFieldLocale(locale).setValue(value)
  }

  async removeValue(locale?: string) {
    await this.setValue(undefined, locale)
  }

  onValueChanged(locale: string | ((value: any) => void), handler?: (value: any) => void) {
    const h = handler || locale
    if (!handler) {
      locale = ''
    }
    return this._getFieldLocale(locale as string).onValueChanged(h as any)
  }

  onIsDisabledChanged(
    locale: string | ((isDisabled: boolean) => void),
    handler?: (isDisabled: boolean) => void,
  ) {
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

  private assertHasLocale(locale: string) {
    if (!this._fieldLocales[locale]) {
      throw new Error(`Unknown locale "${locale}" for field "${this.id}"`)
    }
  }

  private toFieldInfo(value: EntryFieldInfo, locale: string): FieldInfo {
    const fieldInfo = {
      id: value.id,
      name: value.name,
      required: value.required,
      validations: value.validations,
      locale,
      value: value.values[locale],
      isDisabled: value.isDisabled[locale],
      schemaErrors: value.schemaErrors[locale],
    }
    switch (value.type) {
      case 'Array':
        return {
          ...fieldInfo,
          type: value.type,
          items: value.items,
        }
      case 'Link':
        return {
          ...fieldInfo,
          type: value.type,
          linkType: value.linkType,
        }
      default:
        return {
          ...fieldInfo,
          type: value.type,
        }
    }
  }
}

class BasicEntryField extends EntryField implements BasicEntryFieldAPI {
  type: BasicEntryFieldAPI['type']

  constructor(channel: Channel, info: BasicEntryFieldInfo, defaultLocale: string) {
    super(channel, info, defaultLocale)
    this.type = info.type
  }
}

class ArrayEntryField extends EntryField implements ArrayEntryFieldAPI {
  type: ArrayEntryFieldAPI['type']
  items: Items

  constructor(channel: Channel, info: ArrayEntryFieldInfo, defaultLocale: string) {
    super(channel, info, defaultLocale)
    this.type = info.type
    this.items = info.items
  }
}

class LinkEntryField extends EntryField implements LinkEntryFieldAPI {
  type: LinkEntryFieldAPI['type']
  linkType: FieldLinkType

  constructor(channel: Channel, info: LinkEntryFieldInfo, defaultLocale: string) {
    super(channel, info, defaultLocale)
    this.type = info.type
    this.linkType = info.linkType
  }
}

export function makeField(
  channel: Channel,
  info: EntryFieldInfo,
  defaultLocale: string,
): EntryFieldAPI {
  switch (info.type) {
    case 'Array':
      return new ArrayEntryField(channel, info, defaultLocale)
    case 'Link':
      return new LinkEntryField(channel, info, defaultLocale)
    default:
      return new BasicEntryField(channel, info, defaultLocale)
  }
}
