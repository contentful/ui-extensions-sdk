import { MemoizedSignal, Signal } from '../../lib/api/signal'
import {noop} from '../helpers'

describe('MemoizedSignal', () => {
  it('calls the listener with the initial value', () => {
    const spy = sinon.spy()

    new MemoizedSignal('zweiundvierzig').attach(spy)
    expect(spy).to.have.been.calledWithExactly('zweiundvierzig')
  })

  it('throws if there is no initial value provided', () => {
    expect(() => new MemoizedSignal()).to.throw()
  })

  it('calls listener with most recently dispatched value', () => {
    const spy = sinon.spy()
    const args = [1, 'string', null, {}]
    const signal = new MemoizedSignal(42)

    signal.dispatch(...args)
    signal.attach(spy)
    sinon.assert.calledWithExactly(spy, ...args)
  })

  test(MemoizedSignal)
})


describe('Signal', () => test(Signal))

function test (SignalConstructor) {
  describe('instance', () => {
    let signal
    let spies
    beforeEach(() => {
      signal = new SignalConstructor(40)
      spies = {
        one: sinon.spy(),
        two: sinon.spy(),
        three: sinon.spy(),
        reset () {
          this.one.reset()
          this.two.reset()
          this.three.reset()
        },
        expectCallCount (obj) {
          for (let name in obj) {
            expect(this[name]).to.have.callCount(obj[name])
          }
        }
      }
    })

    describe('attach(listener)', () => {
      it('returns a function', () => {
        expect(signal.attach(noop)).to.be.a('function')
      })

      it('throws an error if listener is not a function', () => {
        ['foo', undefined, 42].forEach((value) => {
          expect(() => { signal.attach(value) }).to.throw()
        })
      })

      it('detaches listener when returned function is invoked', () => {
        const detach = signal.attach(spies.one)

        spies.reset() // deal with memoization behaviour

        signal.dispatch('holdthedoor')
        sinon.assert.calledOnce(spies.one)
        spies.reset()
        detach()
        signal.dispatch()
        sinon.assert.notCalled(spies.one)
      })
    })

    describe('dispatch()', () => {
      it('fires attached listeners in the same order they were attached', () => {
        signal.attach(spies.one)
        signal.attach(spies.two)
        signal.attach(spies.three)
        spies.reset() // since MemoizedSignal invokes cb on attach
        signal.dispatch()

        spies.expectCallCount({one: 1, two: 1, three: 1})

        sinon.assert.callOrder(spies.one, spies.two, spies.three)
      })

      it('does not fire detached listeners', () => {
        signal.attach(spies.one)()
        signal.attach(spies.two)
        spies.reset()
        signal.dispatch()

        spies.expectCallCount({one: 0, two: 1})
      })

      it('fires reattached listeners', () => {
        signal.attach(spies.one)()
        spies.reset()
        signal.dispatch()

        spies.expectCallCount({one: 0})

        signal.attach(spies.one)
        spies.reset()
        signal.dispatch()

        spies.expectCallCount({one: 1})
      })

      it('fires same listener attached twice two times', () => {
        const detachSpyOneA = signal.attach(spies.one)
        signal.attach(spies.one)
        spies.reset() // reset call count increment caused by memoization behaviour
        signal.dispatch()
        spies.expectCallCount({one: 2})

        detachSpyOneA()
        signal.dispatch()

        spies.expectCallCount({one: 3})
      })

      it('passes given arguments to the listeners', () => {
        const args = ['foo', 42, {}]
        signal.attach(spies.one)

        signal.dispatch(...args)
        sinon.assert.calledWithExactly(spies.one, ...args)

        signal.dispatch()
        sinon.assert.calledWithExactly(spies.one)
      })
    })
  })
}
