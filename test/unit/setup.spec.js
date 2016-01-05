import setup from '../../lib/api/setup'

describe(`setup(apiCreator)`, () => {
  let cfWidget
  beforeEach(() => {
    cfWidget = setup(function () { return {} })
  })

  describe(`returned "Contentful widget" object`, () => {
    it(`has a .init()`, () => {
      expect(cfWidget.init).to.be.a('function')
    })

    describe(`.init(callback)`, () => {
      it(`is a function`, () => {
        expect(cfWidget.init).to.be.a('function')
      })

      describe(`called before Widget API is ready`, () => {
        it(`does not invoke callback`, () => {
          const spy = sinon.spy()
          cfWidget.init(spy)
          expect(spy).to.have.callCount(0)
        })
      })

      describe(`called after Widget API is ready`, () => {
        it(`immediately invokes callback`, (done) => {
          signalWidgetReady()
          setTimeout(() => {
            const spy = sinon.spy()
            cfWidget.init(spy)
            expect(spy).to.have.callCount(1)
            done()
          }, 0)
        })
      })

      describe(`callback`, () => {
        it(`gets invoked once ready state got signaled`, (done) => {
          cfWidget.init(() => done())
          signalWidgetReady()
        })
        it(`does not get called again if ready state is signaled again `, (done) => {
          cfWidget.init(() => {
            const spy = sinon.spy()
            cfWidget.init(spy)
            expect(spy).to.have.callCount(1)
            done()
          })
          signalWidgetReady()
        })
      })
    })
  })

  function signalWidgetReady () {
    window.postMessage({
      method: 'connect',
      params: []
    }, '*')
  }
})
