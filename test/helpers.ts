import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import { JSDOM } from 'jsdom'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const { expect } = chai

export const makeDOM = () => new JSDOM('<!DOCTYPE html>')

export { sinon, expect }

export function mockMutationObserver(dom: JSDOM, registerMutationTrigger: Function) {
  const MutationObserverMock = function (cb: Function) {
    registerMutationTrigger(cb)
  }
  MutationObserverMock.prototype.observe = () => {}
  MutationObserverMock.prototype.disconnect = () => {
    registerMutationTrigger(() => {})
  }

  Object.defineProperty(dom.window, 'MutationObserver', {
    writable: false,
    value: MutationObserverMock,
  })
}

export function mockResizeObserver(dom, registerResizeTrigger: Function) {
  const ResizeObserverMock = function (cb: Function) {
    registerResizeTrigger(cb)
  }
  ResizeObserverMock.prototype.observe = () => {}
  ResizeObserverMock.prototype.disconnect = () => {
    registerResizeTrigger(() => {})
  }

  Object.defineProperty(dom.window, 'ResizeObserver', {
    writable: false,
    value: ResizeObserverMock,
  })
}

export function describeAttachHandlerMember(msg: string, attachHandlerFn: Function) {
  describe(msg, () => {
    it('returns a function to detach the handler', () => {
      expect(attachHandlerFn()).to.be.a('function')
    })
    describe('returned function', () => {
      it('can be executed without error', () => {
        const detachHandler = attachHandlerFn()
        expect(detachHandler).to.not.throw()
      })
    })
  })
}

export function describeChannelCallingMethod(spec: {
  creator: Function
  methodName: string
  args: any
  expectedCallArgs?: any
  channelMethod?: string
}) {
  const { creator, methodName, args } = spec
  const expectedCallArgs = spec.expectedCallArgs || args
  const channelMethod = spec.channelMethod || methodName

  describe(`.${methodName}()`, () => {
    let object: any
    let channelCallStub: any

    beforeEach(() => {
      channelCallStub = sinon.stub()
      object = creator({
        call: channelCallStub,
        addHandler: sinon.spy(),
      })
    })

    it('is a function', () => {
      expect(object[methodName]).to.be.a('function')
    })

    it(`invokes channel.call('${channelMethod}')`, () => {
      object[methodName](...args)
      expect(channelCallStub)
        .to.have.callCount(1)
        .and.to.have.been.calledWithExactly(...[channelMethod].concat(expectedCallArgs))
    })

    it('returns the promise returned by internal channel.call()', () => {
      channelCallStub.withArgs(channelMethod).returns('PROMISE')
      expect(object[methodName]()).to.equal('PROMISE')
    })
  })
}
