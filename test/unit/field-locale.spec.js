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
      value: 'Hello'
    }
    let field
    beforeEach(() => {
      const infoCopy = JSON.parse(JSON.stringify(info))
      field = new FieldLocale(channelStub, infoCopy)
    })

    it(`is a FieldLocale instance`, () => {
      expect(field).to.be.instanceof(FieldLocale)
    })

    describe('.id', () => {
      it(`is equal to info.id`, () => {
        expect(field.id).to.equal(info.id)
      })
    })

    describe('.locale', () => {
      it(`is set to the same value as given to first constructor arg's .locale`, () => {
        expect(field.locale).to.equal(info.locale)
      })
    })

    describe('.getValue()', () => {
      it(`returns the field's value`, () => {
        expect(field.getValue()).to.equal(info.value)
      })
    })

    describe('.setValue(value)', () => {
      const newValue = `new-value`

      beforeEach(() => {
        field.setValue(newValue)
      })

      it(`changes the value`, () => {
        expect(field.getValue()).to.equal(newValue)
      })
      it(`invokes channel.call("setValue", ...)`, () => {
        expect(channelStub.call).to.have.been.calledWithExactly(
          'setValue', field.id, info.locale, newValue)
      })
      it(`returns the promise returned by internal channel.call()`, () => {
        channelStub.call.withArgs('setValue').returns('PROMISE')
        expect(field.setValue('val')).to.equal('PROMISE')
      })
    })

    describeAttachHandlerMember(`.onValueChanged(handler)`, () => {
      return field.onValueChanged(noop)
    })

    describe(`injected channel propagating "valueChanged"`, () => {
      const newValue = 'some new, unused value'

      let valueChangedHandler
      beforeEach(() => {
        // The handler registered with channel.addHandler("valueChanged", handler)
        valueChangedHandler = channelStub.addHandler.args[0][1]
      })

      describe(`targeted at another field's id`, () => {
        it(`does not update the value`, () => {
          const oldValue = field.getValue()
          valueChangedHandler(`${field.id}-other-id`, defaultLocale, newValue)

          expect(oldValue).to.equal(field.getValue())
        })
      })
      describe(`targeted at the field's id`, () => {
        describe(`for specific locale`, () => {
          it(`sets the locale's value to the given one`, () => {
            valueChangedHandler(field.id, defaultLocale, newValue)

            expect(field.getValue()).to.equal(newValue)
          })
        })
      })
    })
  })
})
