import initializeApi from '../../lib/api/initialize'

describe(`initializeApi(apiCreator)`, () => {
  let init
  beforeEach(() => {
    init = initializeApi(function () { return {} })
  })

  describe(`returned init(callback)`, () => {
    it(`is a function`, () => {
      expect(init).to.be.a('function')
    })

    describe(`called before Widget API is ready`, () => {
      it(`does not invoke callback`, () => {
        const spy = sinon.spy()
        init(spy)
        expect(spy).to.have.callCount(0)
      })
    })

    describe(`called after Widget API is ready`, () => {
      it(`immediately invokes callback`, (done) => {
        signalWidgetReady()
        setTimeout(() => {
          const spy = sinon.spy()
          init(spy)
          expect(spy).to.have.callCount(1)
          done()
        }, 0)
      })
    })

    describe(`callback`, () => {
      it(`gets invoked once ready state got signaled`, (done) => {
        init(() => done())
        signalWidgetReady()
      })
      it(`does not get called again if ready state is signaled again `, (done) => {
        init(() => {
          const spy = sinon.spy()
          init(spy)
          expect(spy).to.have.callCount(1)
          done()
        })
        signalWidgetReady()
      })
    })
  })

  function signalWidgetReady () {
    window.postMessage({
      method: 'connect',
      params: [{
        id: 'foo'
      }]
    }, '*')
  }
})
