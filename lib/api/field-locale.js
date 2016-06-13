import { MemoizedSignal } from './signal'

export default class FieldLocale {

  constructor (channel, {id, locale, value, type, isDisabled}) {
    this.id = id
    this.locale = locale
    this.type = type
    this._value = value
    this._valueSignal = new MemoizedSignal(value)
    this._isDisabledSignal = new MemoizedSignal(isDisabled)
    this._channel = channel

    channel.addHandler('valueChanged', (id, locale, value) => {
      if (id === this.id &&
          (!locale || locale === this.locale) &&
          this._value !== value) {
        this._value = value
        this._valueSignal.dispatch(value)
      }
    })

    channel.addHandler('isDisabledChanged', isDisabled => {
      this._isDisabledSignal.dispatch(isDisabled)
    })
  }

  getValue () {
    return this._value
  }

  setValue (value) {
    this._value = value
    return this._channel.call('setValue', this.id, this.locale, value)
  }

  removeValue () {
    this._value = undefined
    return this._channel.call('removeValue', this.id, this.locale)
  }

  setInvalid (isInvalid) {
    return this._channel.call('setInvalid', isInvalid, this.locale)
  }

  setActive (isActive) {
    return this._channel.call('setActive', isActive)
  }

  onValueChanged (handler) {
    return this._valueSignal.attach(handler)
  }

  onIsDisabledChanged (handler) {
    return this._isDisabledSignal.attach(handler)
  }

}
