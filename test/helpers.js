export const noop = function () {}

export function describeAttachHandlerMember (msg, attachHandlerFn) {
  describe(msg, () => {
    it('returns a function to detach the handler', () => {
      expect(attachHandlerFn()).to.be.a('function')
    })
    describe('returned function', () => {
      it('can be executed without error', () => {
        let detachHandler = attachHandlerFn()
        expect(detachHandler).to.not.throw()
      })
    })
  })
}

export function describeChannelCallingMethod ({
  creator, methodName, channelMethod, args, expectedCallArgs
}) {
  expectedCallArgs = expectedCallArgs || args
  channelMethod = channelMethod || methodName

  describe(`.${methodName}()`, () => {
    let object
    let channelCallStub

    beforeEach(() => {
      channelCallStub = sinon.stub()
      object = creator({ call: channelCallStub })
    })

    it('is a function', () => {
      expect(object[methodName]).to.be.a('function')
    })

    it(`invokes channel.call('${channelMethod}')`, () => {
      object[methodName](...args)
      expect(channelCallStub)
        .to.have.callCount(1).and
        .to.have.been.calledWithExactly(...[channelMethod].concat(expectedCallArgs))
    })

    it('returns the promise returned by internal channel.call()', () => {
      channelCallStub.withArgs(channelMethod).returns('PROMISE')
      expect(object[methodName]()).to.equal('PROMISE')
    })
  })
}
