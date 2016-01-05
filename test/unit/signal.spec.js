import Signal from '../../lib/api/signal'
import {noop} from '../helpers'

describe(`Signal`, () => {
  describe(`constructor`, () => {
    it(`creates a Signal instance`, () => {
      expect(new Signal()).to.be.instanceof(Signal)
    })
  })

  describe(`instance`, () => {
    let signal
    beforeEach(() => {
      signal = new Signal()
    })

    describe(`attach(listener)`, () => {
      it(`returns a function`, () => {
        expect(signal.attach(noop)).to.be.a('function')
      })
      it(`throws an error if listener is not a function`, () => {
        ['foo', undefined, 42].forEach((value) => {
          expect(() => { signal.attach(value) }).to.throw()
        })
      })
    })

    describe(`dispatch()`, () => {
      it(`returns nothing and does not fail`, () => {
        expect(signal.dispatch()).to.equal(undefined)
      })

      describe(`with previously attached listeners`, () => {
        let spies
        beforeEach(() => {
          spies = {
            one: sinon.spy(),
            two: sinon.spy(),
            three: sinon.spy()
          }
        })

        function expectCallCount (obj) {
          for (let name in obj) {
            expect(spies[name]).to.have.callCount(obj[name])
          }
        }

        it(`fires attached listeners in the same order they were attached`, () => {
          signal.attach(spies.one)
          signal.attach(spies.two)
          signal.attach(spies.three)
          signal.dispatch()

          expectCallCount({one: 1, two: 1, three: 1})

          sinon.assert.callOrder(spies.one, spies.two, spies.three)
        })

        it(`does not fire detached listeners`, () => {
          signal.attach(spies.one)()
          signal.attach(spies.two)
          signal.dispatch()

          expectCallCount({one: 0, two: 1})
        })

        it(`fires reattached listeners`, () => {
          signal.attach(spies.one)()
          signal.dispatch()

          expectCallCount({one: 0})

          signal.attach(spies.one)
          signal.dispatch()

          expectCallCount({one: 1})
        })

        it(`fires same listener attached twice two times`, () => {
          const detachSpyOneA = signal.attach(spies.one)
          signal.attach(spies.one)
          signal.dispatch()

          expectCallCount({one: 2})

          detachSpyOneA()
          signal.dispatch()

          expectCallCount({one: 3})
        })

        it(`passes given arguments to the listeners`, () => {
          const args = ['foo', 42, {}]
          signal.attach(spies.one)
          signal.dispatch(...args)

          expect(spies.one).to.have.been.calledWithExactly(...args)

          signal.dispatch()

          expect(spies.one).to.have.been.calledWithExactly()
        })
      })
    })
  })
})
