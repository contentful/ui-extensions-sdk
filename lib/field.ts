import { Channel } from './channel'
import { ArrayFieldLocale, BasicFieldLocale, LinkFieldLocale } from './field-locale'
import { EntryFieldInfo, Items, FieldAPI, FieldLinkType } from './types'
import { ArrayFieldAPI, BasicFieldAPI, LinkFieldAPI } from './types/field-locale.types'
import {
  ArrayEntryFieldAPI,
  ArrayEntryFieldInfo,
  BasicEntryFieldAPI,
  BasicEntryFieldInfo,
  EntryFieldAPI,
  LinkEntryFieldAPI,
  LinkEntryFieldInfo,
} from './types/field.types'

class EntryField {
  private _defaultLocale: string
  protected _fieldLocales: { [key: string]: FieldAPI } = {}
  id: string
  name: string
  locales: string[]
  required: boolean
  validations: Object[]

  constructor(_channel: Channel, info: EntryFieldInfo, defaultLocale: string) {
    this.id = info.id
    this.name = info.name
    this.locales = info.locales
    this.required = info.required
    this.validations = info.validations
    this._defaultLocale = defaultLocale
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

  assertHasLocale(locale: string) {
    if (!this._fieldLocales[locale]) {
      throw new Error(`Unknown locale "${locale}" for field "${this.id}"`)
    }
  }
}

class BasicEntryField extends EntryField implements BasicEntryFieldAPI {
  type: BasicEntryFieldAPI['type']
  protected _fieldLocales: { [key: string]: BasicFieldAPI }

  constructor(channel: Channel, info: BasicEntryFieldInfo, defaultLocale: string) {
    super(channel, info, defaultLocale)
    this.type = info.type

    this._fieldLocales = info.locales.reduce(
      (acc: { [key: string]: BasicFieldAPI }, locale: string) => {
        const fieldLocale = new BasicFieldLocale(channel, {
          id: info.id,
          name: info.name,
          required: info.required,
          validations: info.validations,
          locale,
          value: info.values[locale],
          isDisabled: info.isDisabled[locale],
          schemaErrors: info.schemaErrors[locale],
          type: info.type,
        })
        return { ...acc, [locale]: fieldLocale }
      },
      {},
    )
    this.assertHasLocale(defaultLocale)
  }
}

class ArrayEntryField extends EntryField implements ArrayEntryFieldAPI {
  type: ArrayEntryFieldAPI['type']
  items: Items
  protected _fieldLocales: { [key: string]: ArrayFieldAPI }

  constructor(channel: Channel, info: ArrayEntryFieldInfo, defaultLocale: string) {
    super(channel, info, defaultLocale)
    this.type = info.type
    this.items = info.items
    this._fieldLocales = info.locales.reduce(
      (acc: { [key: string]: ArrayFieldAPI }, locale: string) => {
        const fieldLocale = new ArrayFieldLocale(channel, {
          id: info.id,
          name: info.name,
          required: info.required,
          validations: info.validations,
          locale,
          value: info.values[locale],
          isDisabled: info.isDisabled[locale],
          schemaErrors: info.schemaErrors[locale],
          type: info.type,
          items: info.items,
        })
        return { ...acc, [locale]: fieldLocale }
      },
      {},
    )
    this.assertHasLocale(defaultLocale)
  }
}

class LinkEntryField extends EntryField implements LinkEntryFieldAPI {
  type: LinkEntryFieldAPI['type']
  linkType: FieldLinkType
  protected _fieldLocales: { [key: string]: LinkFieldAPI }

  constructor(channel: Channel, info: LinkEntryFieldInfo, defaultLocale: string) {
    super(channel, info, defaultLocale)
    this.type = info.type
    this.linkType = info.linkType

    this._fieldLocales = info.locales.reduce(
      (acc: { [key: string]: LinkFieldAPI }, locale: string) => {
        const fieldLocale = new LinkFieldLocale(channel, {
          id: info.id,
          name: info.name,
          required: info.required,
          validations: info.validations,
          locale,
          value: info.values[locale],
          isDisabled: info.isDisabled[locale],
          schemaErrors: info.schemaErrors[locale],
          type: info.type,
          linkType: info.linkType,
        })
        return { ...acc, [locale]: fieldLocale }
      },
      {},
    )
    this.assertHasLocale(defaultLocale)
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
