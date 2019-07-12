const sinon = require('sinon')
const { JSDOM } = require('jsdom')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(sinonChai)
chai.use(chaiAsPromised)

const { expect } = chai

module.exports = {
  sinon,
  makeDOM: () => new JSDOM('<!DOCTYPE html>'),
  mockMutationObserver,
  expect,
  describeAttachHandlerMember,
  describeChannelCallingMethod
}

function mockMutationObserver(dom, registerMutationTrigger) {
  const MutationObserverMock = function(cb) {
    registerMutationTrigger(cb)
  }
  MutationObserverMock.prototype.observe = () => {}
  MutationObserverMock.prototype.disconnect = () => {
    registerMutationTrigger(() => {})
  }

  Object.defineProperty(dom.window, 'MutationObserver', {
    writable: false,
    value: MutationObserverMock
  })
}

function describeAttachHandlerMember(msg, attachHandlerFn) {
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

function describeChannelCallingMethod(spec) {
  const { creator, methodName, args } = spec
  const expectedCallArgs = spec.expectedCallArgs || args
  const channelMethod = spec.channelMethod || methodName

  describe(`.${methodName}()`, () => {
    let object
    let channelCallStub

    beforeEach(() => {
      channelCallStub = sinon.stub()
      object = creator({
        call: channelCallStub,
        addHandler: sinon.spy()
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
