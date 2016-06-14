import FieldLocale from '../../lib/api/field-locale'
import {
  noop,
  describeAttachHandlerMember
} from '../helpers'

describe('FieldLocale', () => {
  let channelStub
  beforeEach(() => {
    channelStub = {
      addHandler: sinon.stub(),
      call: sinon.stub()
    }
  })

  describe('instance', () => {
    const defaultLocale = 'en-US'
    const info = {
      id: 'some-field',
      locale: 'en-US',
      value: 'Hello',
      type: 'Symbol',
      isDisabled: true
    }
    let field
    beforeEach(() => {
      const infoCopy = JSON.parse(JSON.stringify(info))
      field = new FieldLocale(channelStub, infoCopy)
    })

    it('is a FieldLocale instance', () => {
      expect(field).to.be.instanceof(FieldLocale)
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
      it('invokes channel.call("${setInvalid}", ...)', () => {
        field.setInvalid(true)
        sinon.assert.calledWithExactly(channelStub.call, 'setInvalid', true, info.locale)
      })
    })

    describe('.setActive()', () => {
      it('invokes channel.call("${setActive}", ...)', () => {
        field.setActive(true)
        sinon.assert.calledWithExactly(channelStub.call, 'setActive', true)
      })
    })

    describe('.onValueChanged(handler)', () => {
      testChangeMethod('onValueChanged', info.value)
    })

    describe('.onIsDisabledChanged(handler)', () => {
      testChangeMethod('onIsDisabledChanged', info.isDisabled)
    })

    describe('injected channel propagating "isDisabledChanged"', () => {
      let isDisabledChangedHandler

      beforeEach(() => {
        isDisabledChangedHandler = channelStub.addHandler.args[1][1]
      })

      it('calls the handler with given value', () => {
        const cb = sinon.spy()

        field.onIsDisabledChanged(cb)
        sinon.assert.calledOnce(cb)
        sinon.assert.calledWithExactly(cb, info.isDisabled)
        isDisabledChangedHandler('ISDISABLED')
        sinon.assert.calledTwice(cb)
        sinon.assert.calledWithExactly(cb, 'ISDISABLED')
      })
    })

    describe('injected channel propagating "valueChanged"', () => {
      const newValue = 'some new, unused value'
      let valueChangedHandler
      beforeEach(() => {
        // The handler registered with channel.addHandler("valueChanged", handler)
        valueChangedHandler = channelStub.addHandler.args[0][1]
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

      describe('targeted at another field\'s id', () => {
        it('does not update the value', () => {
          const oldValue = field.getValue()
          valueChangedHandler(`${field.id}-other-id`, defaultLocale, newValue)

          expect(oldValue).to.equal(field.getValue())
        })
      })
      describe('targeted at the field\'s id', () => {
        describe('for specific locale', () => {
          it('sets the locale\'s value to the given one', () => {
            valueChangedHandler(field.id, defaultLocale, newValue)

            expect(field.getValue()).to.equal(newValue)
          })
        })
        describe('without locale provided', () => {
          it('sets the locale\'s value to the given one', () => {
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

      it('invokes channel.call("${method}", ...)', () => {
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

    function testChangeMethod (methodName, initialValue) {
      describeAttachHandlerMember('default behaviour', () => {
        return field[methodName](noop)
      })

      it('calls handler immediately on attach with initial value of field', () => {
        const spy = sinon.spy()

        field[methodName](spy)
        sinon.assert.calledOnce(spy)
        sinon.assert.calledWithExactly(spy, initialValue)
      })
    }
  })
})
