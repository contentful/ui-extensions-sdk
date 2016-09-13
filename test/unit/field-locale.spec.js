import FieldLocale from '../../lib/api/field-locale'
import cloneDeep from 'lodash/cloneDeep'
import {
  noop,
  describeAttachHandlerMember
} from '../helpers'

describe('FieldLocale', () => {
  const defaultLocale = 'en-US'
  const info = {
    id: 'some-field',
    locale: 'en-US',
    value: 'Hello',
    type: 'Symbol',
    validations: 'VALIDATIONS'
  }
  let channelStub
  let field

  beforeEach(() => {
    channelStub = {
      _handlers: {},
      addHandler: function (method, cb) {
        this._handlers[method] = cb
      },
      call: sinon.stub(),
      receiveMethod: function (method, params) {
        this._handlers[method](...params)
      }
    }

    const infoCopy = cloneDeep(info)
    field = new FieldLocale(channelStub, infoCopy)
  })

  describe('.id', () => {
    it('is equal to info.id', () => {
      expect(field.id).to.equal(info.id)
    })
  })

  describe('.type', () => {
    it('is equal to info.type', () => {
      expect(field.type).to.equal(info.type)
    })
  })

  describe('.locale', () => {
    it('is set to the same value as given to first constructor arg\'s .locale', () => {
      expect(field.locale).to.equal(info.locale)
    })
  })

  describe('.validations', () => {
    it('is equal to info.validations', () => {
      expect(field.validations).to.equal(info.validations)
    })
  })

  describe('.getValue()', () => {
    it('returns the field\'s value', () => {
      expect(field.getValue()).to.equal(info.value)
    })
  })

  describe('.setValue(value)', () => {
    testValueMethods('setValue', 'new-value')
  })

  describe('.removeValue()', () => {
    testValueMethods('removeValue')
  })

  describe('.setInvalid()', () => {
    it('invokes channel.call("setInvalid", ...)', () => {
      field.setInvalid(true)
      sinon.assert.calledWithExactly(channelStub.call, 'setInvalid', true, info.locale)
    })
  })

  describe('.onIsDisabledChanged(handler)', () => {
    testChannelSignal('onIsDisabledChanged', 'isDisabledChanged')
  })

  describe('.onSchemaErrorsChanged(handler)', () => {
    testChannelSignal('onSchemaErrorsChanged', 'schemaErrorsChanged')
  })

  describe('.onValueChanged(handler)', () => {
    const newValue = 'some new, unused value'
    let valueChangedHandler
    beforeEach(() => {
      valueChangedHandler = function (...args) {
        channelStub.receiveMethod('valueChanged', args)
      }
    })

    describeAttachHandlerMember('default behaviour', () => {
      return field.onValueChanged(noop)
    })

    it('calls handler immediately on attach with initial value of field', () => {
      const spy = sinon.spy()
      field.onValueChanged(spy)
      sinon.assert.calledOnce(spy)
      sinon.assert.calledWithExactly(spy, info.value)
    })

    describe('New value equals current value', () => {
      it('does not dispatch new value', () => {
        const oldValue = field.getValue()
        const cb = sinon.spy()

        field.onValueChanged(cb)
        sinon.assert.calledOnce(cb)
        valueChangedHandler(field.id, defaultLocale, oldValue)
        sinon.assert.calledOnce(cb)
      })
    })

    describe('targeted at another field’s id', () => {
      it('does not update the value', () => {
        const oldValue = field.getValue()
        valueChangedHandler(`${field.id}-other-id`, defaultLocale, newValue)

        expect(oldValue).to.equal(field.getValue())
      })
    })

    describe('targeted at the field’s id', () => {
      describe('for specific locale', () => {
        it('sets the locale’s value to the given one', () => {
          valueChangedHandler(field.id, defaultLocale, newValue)

          expect(field.getValue()).to.equal(newValue)
        })
      })
      describe('without locale provided', () => {
        it('sets the locale’s value to the given one', () => {
          valueChangedHandler(field.id, undefined, newValue)

          expect(field.getValue()).to.equal(newValue)
        })
      })
    })
  })

  function testValueMethods (method, newValue) {
    beforeEach(() => {
      field[method](newValue)
    })

    it(`sets the value to ${newValue}`, () => {
      expect(field.getValue()).to.equal(newValue)
    })

    it(`invokes channel.call("${method}", ...)`, () => {
      if (newValue === undefined) {
        expect(channelStub.call).to.have.been.calledWithExactly(
        method, field.id, info.locale)
      } else {
        expect(channelStub.call).to.have.been.calledWithExactly(
        method, field.id, info.locale, newValue)
      }
    })

    it('returns the promise returned by internal channel.call()', () => {
      channelStub.call.withArgs(method).returns('PROMISE')
      expect(field[method]('val')).to.equal('PROMISE')
    })
  }

  function testChannelSignal (method, message) {
    it('calls handler when method is received', () => {
      const cb = sinon.spy()

      field[method](cb)
      cb.reset()
      channelStub.receiveMethod(message, ['VALUE'])
      sinon.assert.calledOnce(cb)
      sinon.assert.calledWithExactly(cb, 'VALUE')
    })

    it('calls handler with last received message', () => {
      channelStub.receiveMethod(message, ['VALUE'])
      const cb = sinon.spy()
      field[method](cb)
      sinon.assert.calledOnce(cb)
      sinon.assert.calledWithExactly(cb, 'VALUE')
    })
  }
})
