import Signal from './signal'

export default class FieldLocale {

  constructor (channel, {id, locale, value}) {
    this.id = id
    this.locale = locale

    this._value = value
    this._valueSignal = new Signal()
    this._channel = channel

    channel.addHandler('valueChanged', (id, locale, value) => {
      if (id === this.id && locale === this.locale) {
        this._value = value
        this._valueSignal.dispatch(value)
      }
    })
  }

  getValue () {
    return this._value
  }

  setValue (value) {
    return this._channel.call('setValue', this.id, this.locale, value)
  }

  onValueChanged (handler) {
    return this._valueSignal.attach(handler)
  }

}
