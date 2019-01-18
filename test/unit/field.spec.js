const { sinon, expect, describeAttachHandlerMember } = require('../helpers')

const Field = require('../../lib/field')

describe(`Field`, () => {
  let channelStub
  beforeEach(() => {
    channelStub = {
      addHandler: sinon.stub(),
      call: sinon.stub()
    }
  })

  describe(`construction error`, () => {
    it(`gets thrown if defaultLocale is not included in info.locales`, () => {
      expect(() => {
        return new Field(channelStub, { id: 'x', locales: ['de-DE'], values: {} }, 'en-US')
      }).to.throw('Unknown locale "en-US" for field "x"')
    })
  })

  describe(`instance`, () => {
    const defaultLocale = 'en-US'
    const localeWithoutValue = 'locale-without-value'
    const unknownLocale = 'some-unknown-locale'
    const info = {
      id: 'some-field',
      locales: ['en-US', 'it-IT', 'de-DE', localeWithoutValue],
      values: {
        'en-US': 'Hello',
        'it-IT': 'Ciao',
        'de-DE': 'Hallo'
      },
      type: 'Symbol',
      validations: 'VALIDATIONS'
    }
    let field
    beforeEach(() => {
      const infoCopy = JSON.parse(JSON.stringify(info))
      field = new Field(channelStub, infoCopy, defaultLocale)
    })

    it(`is a Field instance`, () => {
      expect(field).to.be.instanceof(Field)
    })

    describe(`.id`, () => {
      it(`is equal to info.id`, () => {
        expect(field.id).to.equal(info.id)
      })
    })

    describe(`.locales`, () => {
      it(`is set to the same value as info.locales`, () => {
        expect(field.locales).to.deep.equal(info.locales)
      })
    })

    describe(`.type`, () => {
      it(`is set to the same value as info.type`, () => {
        expect(field.type).to.equal(info.type)
      })
    })

    describe(`.validations`, () => {
      it(`is set to the same value as info.validations`, () => {
        expect(field.validations).to.equal(info.validations)
      })
    })

    describe(`.getValue()`, () => {
      it(`returns the default locale's value`, () => {
        expect(field.getValue()).to.equal(info.values[defaultLocale])
      })
    })

    describe(`.getValue(locale)`, () => {
      describe(`with locale set to the default locale "${defaultLocale}"`, () => {
        it(`returns the value for the given locale`, () => {
          expect(field.getValue(defaultLocale)).to.equal(info.values[defaultLocale])
        })
      })

      describe(`with locale set to a locale without value`, () => {
        it(`returns undefined`, () => {
          expect(field.getValue(localeWithoutValue)).to.equal(undefined)
        })
      })

      it(`throws UnknownLocaleError when locale is unknown to the field`, () => {
        expect(() => {
          field.getValue(unknownLocale)
        }).to.throw('Unknown locale "some-unknown-locale" for field "some-field"')
      })

      info.locales.forEach((locale) => {
        if (locale === defaultLocale) {
          return
        }
        describe(`with locale set to "${locale}"`, () => {
          it(`returns the value for the given locale`, () => {
            expect(field.getValue(locale)).to.equal(info.values[locale])
          })
        })
      })
    })

    describeSetValue(`.setValue(value)`, undefined, defaultLocale)

    describe(`.setValue(value, locale)`, () => {
      info.locales.forEach((locale) => {
        describeSetValue(`with locale set to "${locale}"`, locale, locale)
      })

      it(`throws an error if locale is unknown to the field`, () => {
        expect(() => {
          field.setValue('value', unknownLocale)
        }).to.throw('Unknown locale "some-unknown-locale" for field "some-field"')
      })
    })

    function describeSetValue (msg, locale, localeOrDefault) {
      describe(msg, () => {
        const newValue = `new-value-${localeOrDefault}`

        beforeEach(() => {
          field.setValue(newValue, locale)
        })

        it(`changes the locale's value`, () => {
          expect(field.getValue(locale)).to.equal(newValue)
        })
        it(`invokes channel.call("setValue", ...)`, () => {
          expect(channelStub.call).to.have.been.calledWithExactly(
            'setValue', field.id, localeOrDefault, newValue)
        })
        it(`returns the promise returned by internal channel.call()`, () => {
          channelStub.call.withArgs('setValue').returns('PROMISE')
          expect(field.setValue('val')).to.equal('PROMISE')
        })
      })
    }

    describeRemoveValue(`.removeValue()`, undefined)

    describe(`.removeValue(locale)`, () => {
      info.locales.forEach((locale) => {
        describeRemoveValue(`with locale set to "${locale}"`, locale)
      })

      it(`throws an error if locale is unknown to the field`, () => {
        expect(() => {
          field.removeValue(unknownLocale)
        }).to.throw('Unknown locale "some-unknown-locale" for field "some-field"')
      })
    })

    function describeRemoveValue (msg, locale) {
      describe(msg, () => {
        const localeParam = locale ? `"${locale}"` : 'undefined'

        it(`is just a call to .setValue(undefined, ${localeParam})`, () => {
          const setValueSpy = sinon.spy(field, 'setValue')
          field.removeValue(locale)

          expect(setValueSpy)
            .to.have.callCount(1).and
            .to.have.been.calledWithExactly(undefined, locale)
        })
        it(`returns the same value as .setValue(undefined, ${localeParam})`, () => {
          let setValueStub = sinon.stub(field, 'setValue')
          setValueStub.returns('PROMISE')
          expect(field.removeValue()).to.equal('PROMISE')
        })
        it(`makes .getValue(${localeParam}) return undefined`, () => {
          field.removeValue(locale)
          expect(field.getValue(locale)).to.equal(undefined)
        })
      })
    }

    describeAttachHandlerMember(`.onValueChanged(handler)`, () => {
      return field.onValueChanged(() => {})
    })

    describe(`.onValueChanged(locale, handler)`, () => {
      info.locales.forEach((locale) => {
        describeAttachHandlerMember(`with locale set to ${locale}`, () => {
          return field.onValueChanged(locale, () => {})
        })
      })

      it(`throws an error if locale is unknown to the field`, () => {
        expect(() => {
          field.onValueChanged(unknownLocale, () => {})
        }).to.throw('Unknown locale "some-unknown-locale" for field "some-field"')
      })
    })

    describe(`injected channel propagating "valueChanged"`, () => {
      beforeEach(function () {
        this.receiveValueChanged = (...handlerArgs) => {
          channelStub.addHandler.args.forEach((args) => {
            // Handler registered with channel.addHandler("valueChanged", handler)
            args[1](...handlerArgs)
          })
        }
      })

      it('does not update the value when receiving update for another field',
        function () {
          const oldValue = field.getValue()
          this.receiveValueChanged('other-id', defaultLocale, 'NEW')

          expect(oldValue).to.equal(field.getValue())
        })

      it(`updates the value when receiving a change message`, function () {
        this.receiveValueChanged(field.id, defaultLocale, 'CHANGED')
        expect(field.getValue()).to.equal('CHANGED')
      })
    })
  })
})
