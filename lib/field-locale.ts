import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { FieldInfo, FieldType, FieldLinkType, Items, SerializedJSONValue } from './types'
import { ExhaustiveFieldAPI } from './types/field-locale.types'
import { ValidationError } from './types/validation-error'

export default class FieldLocale implements ExhaustiveFieldAPI {
  id: string
  name: string
  locale: string
  type: FieldType
  required: boolean
  validations: any[]
  items?: Items
  linkType?: FieldLinkType
  private _value: any

  private _valueSignal: MemoizedSignal<[any]>
  private _isDisabledSignal: MemoizedSignal<[boolean]>
  private _schemaErrorsChangedSignal: MemoizedSignal<[ValidationError[]]>
  private _channel: Channel

  constructor(channel: Channel, info: FieldInfo) {
    this.id = info.id
    this.name = info.name
    this.locale = info.locale
    this.type = info.type
    this.required = info.required
    this.validations = info.validations
    if (info.type === 'Array') {
      this.items = info.items
    }
    if (info.type === 'Link') {
      this.linkType = info.linkType
    }
    this._value = info.value
    this._valueSignal = new MemoizedSignal(this._value)
    this._isDisabledSignal = new MemoizedSignal<[boolean]>(info.isDisabled)
    this._schemaErrorsChangedSignal = new MemoizedSignal<[ValidationError[]]>(info.schemaErrors)
    this._channel = channel

    channel.addHandler('valueChanged', (id: string, locale: string, value: any) => {
      if (id === this.id && (!locale || locale === this.locale)) {
        this._value = value
        this._valueSignal.dispatch(value)
      }
    })

    channel.addHandler(
      'isDisabledChangedForFieldLocale',
      (id: string, locale: string, isDisabled: boolean) => {
        if (id === this.id && locale === this.locale) {
          this._isDisabledSignal.dispatch(isDisabled)
        }
      }
    )

    channel.addHandler(
      'schemaErrorsChangedForFieldLocale',
      (id: string, locale: string, errors: ValidationError[]) => {
        if (id === this.id && locale === this.locale) {
          this._schemaErrorsChangedSignal.dispatch(errors)
        }
      }
    )
  }

  getValue() {
    return this._value
  }

  async setValue(value: any) {
    this._value = value
    this._valueSignal.dispatch(value)
    return await this._channel.call<SerializedJSONValue | undefined>(
      'setValue',
      this.id,
      this.locale,
      value
    )
  }

  async removeValue() {
    this._value = undefined
    await this._channel.call('removeValue', this.id, this.locale)
  }

  setInvalid(isInvalid: boolean) {
    return this._channel.call('setInvalid', isInvalid, this.locale)
  }

  onValueChanged(handler: (value: any) => any) {
    return this._valueSignal.attach(handler)
  }

  getIsDisabled(): boolean {
    return this._isDisabledSignal.getMemoizedArgs()[0]
  }

  onIsDisabledChanged(handler: (isDisabled: boolean) => any) {
    return this._isDisabledSignal.attach(handler)
  }

  getSchemaErrors(): ValidationError[] {
    return this._schemaErrorsChangedSignal.getMemoizedArgs()[0]
  }

  onSchemaErrorsChanged(handler: (errors: ValidationError[]) => void) {
    return this._schemaErrorsChangedSignal.attach(handler)
  }
}
