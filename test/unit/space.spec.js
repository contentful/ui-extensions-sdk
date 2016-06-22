const spaceMethods = [
  'getContentType',
  'getEntry',
  'getAsset',

  'getPublishedEntries',
  'getPublishedAssets',
  'getContentTypes',
  'getEntries',
  'getAssets',

  'createContentType',
  'createEntry',
  'createAsset',

  'updateContentType',
  'updateEntry',
  'updateAsset',

  'deleteContentType',
  'deleteEntry',
  'deleteAsset',

  'publishEntry',
  'publishAsset',
  'unpublishEntry',
  'unpublishAsset',

  'archiveEntry',
  'archiveAsset',
  'unarchiveEntry',
  'unarchiveAsset',

  'processAsset'
]

import createSpace from '../../lib/api/space'

describe('createSpace()', () => {
  describe('returned "space" object', () => {
    spaceMethods.forEach(describeSpaceMethod)
  })
})

function describeSpaceMethod (methodName) {
  let space
  let channelCallStub
  beforeEach(() => {
    channelCallStub = sinon.stub()
    space = createSpace({
      call: channelCallStub
    })
  })

  describe(`.${methodName}()`, () => {
    it('is a function', () => {
      expect(space[methodName]).to.be.a('function')
    })
    it(`invokes channel.call('callSpaceMethod', '${methodName}', args)`, () => {
      let args = ['foo', 42, {}]
      space[methodName](...args)
      expect(channelCallStub)
        .to.have.callCount(1).and
        .to.have.been.calledWithExactly('callSpaceMethod', methodName, args)
    })
    it('returns the promise returned by internal channel.call()', () => {
      channelCallStub.withArgs('callSpaceMethod').returns('PROMISE')
      expect(space[methodName]()).to.equal('PROMISE')
    })
  })
}
