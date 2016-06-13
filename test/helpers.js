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
