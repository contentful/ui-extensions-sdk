const { sinon, makeDOM, mockMutationObserver, expect } = require('../helpers')

const createWindow = require('../../lib/window')

describe(`createWindow()`, () => {
  describe(`returned "window" object`, () => {
    let dom
    let window
    let modifyDOM
    let channelSendSpy
    beforeEach(() => {
      dom = makeDOM()
      mockMutationObserver(dom, cb => {
        modifyDOM = cb
      })
      channelSendSpy = sinon.spy()
      window = createWindow(dom.window, { send: channelSendSpy })
    })

    it(`has all expected member functions`, () => {
      expect(window.startAutoResizer).to.be.a('function')
      expect(window.stopAutoResizer).to.be.a('function')
      expect(window.updateHeight).to.be.a('function')
    })

    describe(`.startAutoResizer()`, () => {
      let updateHeightSpy
      beforeEach(() => {
        updateHeightSpy = sinon.stub(window, 'updateHeight')
        window.startAutoResizer()
      })

      it(`calls .updateHeight() initially`, () => {
        expect(updateHeightSpy.callCount).to.equal(1)
      })
      it(`calls .updateHeight() without arguments (auto mode)`, () => {
        expect(updateHeightSpy).to.have.been.calledWithExactly()
      })

      describe(`after auto resizer got started`, () => {
        it(`listens to DOM changes and invokes .updateHeigt()`, done => {
          updateHeightSpy.restore()
          updateHeightSpy = sinon.stub(window, 'updateHeight').callsFake(() => {
            expect(updateHeightSpy).to.have.callCount(1)
            done()
          })
          modifyDOM()
        })

        it(`listens to global "resize" event and invokes .updateHeight()`, () => {
          fireViewportResize(dom)
          expect(updateHeightSpy).to.have.callCount(2)
        })
      })

      describe(`followed by .stopAutoResizer()`, () => {
        beforeEach(() => {
          window.stopAutoResizer()
          updateHeightSpy.reset()
        })

        it(`stops observing DOM and does not invoke updateHeight()`, done => {
          setTimeout(() => {
            expect(updateHeightSpy).to.have.callCount(0)
            done()
          }, 0)
          modifyDOM()
        })

        it(`stops listening to "resize" event does not invoke .updateHeight()`, () => {
          fireViewportResize(dom)
          expect(updateHeightSpy).to.have.callCount(0)
        })
      })
    })

    describe(`.stopAutoResizer()`, () => {
      it(`returns nothing, does not fail`, () => {
        expect(window.stopAutoResizer()).to.equal(undefined)
      })
    })

    describe(`.updateHeight()`, () => {
      it(`notifies the parent window`, () => {
        window.updateHeight()
        expect(channelSendSpy).to.have.callCount(1)
      })
    })

    describe(`.updateHeight(number)`, () => {
      beforeEach(() => {
        window.updateHeight(42)
      })

      it(`notifies the parent window`, () => {
        expect(channelSendSpy).to.have.callCount(1)
      })

      describe(`called a second time with the same number`, () => {
        it(`does not notify the parent window a second time`, () => {
          window.updateHeight(42)
          expect(channelSendSpy).to.have.callCount(1)
        })
      })
    })
  })
})

function fireViewportResize(dom) {
  const { Event } = dom.window
  dom.window.dispatchEvent(new Event('resize'))
}
