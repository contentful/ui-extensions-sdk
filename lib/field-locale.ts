import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { FieldAPI, FieldInfo, Items } from './types'

export default class FieldLocale implements FieldAPI {
  id: string
  locale: string
  type: string
  required: boolean
  validations: any[]
  items?: Items
  private _value: any

  private _valueSignal: MemoizedSignal
  private _isDisabledSignal: MemoizedSignal
  private _schemaErrorsChangedSignal: MemoizedSignal
  private _channel: any

  constructor(channel: Channel, info: FieldInfo) {
    this.id = info.id
    this.locale = info.locale
    this.type = info.type
    this.required = info.required
    this.validations = info.validations
    this.items = info.items

    this._value = info.value
    this._valueSignal = new MemoizedSignal(this._value)
    this._isDisabledSignal = new MemoizedSignal(undefined)
    this._schemaErrorsChangedSignal = new MemoizedSignal(undefined)
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
      (id: string, locale: string, errors: Error[]) => {
        if (id === this.id && locale === this.locale) {
          this._schemaErrorsChangedSignal.dispatch(errors)
        }
      }
    )
  }

  getValue() {
    return this._value
  }

  setValue(value: any) {
    this._value = value
    this._valueSignal.dispatch(value)
    return this._channel.call('setValue', this.id, this.locale, value)
  }

  removeValue() {
    this._value = undefined
    return this._channel.call('removeValue', this.id, this.locale)
  }

  setInvalid(isInvalid: boolean) {
    return this._channel.call('setInvalid', isInvalid, this.locale)
  }

  onValueChanged(handler: (value: any) => any) {
    return this._valueSignal.attach(handler)
  }

  onIsDisabledChanged(handler: (isDisabled: boolean) => any) {
    return this._isDisabledSignal.attach(handler)
  }

  onSchemaErrorsChanged(handler: Function) {
    return this._schemaErrorsChangedSignal.attach(handler)
  }
}
