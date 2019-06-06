const { MemoizedSignal } = require('./signal')

const INFO_PROPS = ['id', 'locale', 'type', 'required', 'validations', 'items']

module.exports = class FieldLocale {
  constructor (channel, fieldInfo) {
    INFO_PROPS.forEach(prop => {
      const value = fieldInfo[prop]
      if (typeof value !== 'undefined') {
        this[prop] = fieldInfo[prop]
      }
    })

    this._value = fieldInfo.value
    this._valueSignal = new MemoizedSignal(this._value)
    this._isDisabledSignal = new MemoizedSignal(undefined)
    this._schemaErrorsChangedSignal = new MemoizedSignal(undefined)
    this._channel = channel

    channel.addHandler('valueChanged', (id, locale, value) => {
      if (
        id === this.id &&
        (!locale || locale === this.locale)
      ) {
        this._value = value
        this._valueSignal.dispatch(value)
      }
    })

    channel.addHandler('isDisabledChanged', (isDisabled) => {
      this._isDisabledSignal.dispatch(isDisabled)
    })

    channel.addHandler('schemaErrorsChanged', (errors) => {
      this._schemaErrorsChangedSignal.dispatch(errors)
    })
  }

  getValue () {
    return this._value
  }

  setValue (value) {
    this._value = value
    this._valueSignal.dispatch(value)
    return this._channel.call('setValue', this.id, this.locale, value)
  }

  removeValue () {
    this._value = undefined
    return this._channel.call('removeValue', this.id, this.locale)
  }

  setInvalid (isInvalid) {
    return this._channel.call('setInvalid', isInvalid, this.locale)
  }

  onValueChanged (handler) {
    return this._valueSignal.attach(handler)
  }

  onIsDisabledChanged (handler) {
    return this._isDisabledSignal.attach(handler)
  }

  onSchemaErrorsChanged (handler) {
    return this._schemaErrorsChangedSignal.attach(handler)
  }
}
