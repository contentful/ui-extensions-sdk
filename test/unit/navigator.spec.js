const { describeChannelCallingMethod } = require('../helpers')

const createNavigator = require('../../lib/navigator')

const SCENARIOS = [
  {
    method: 'openEntry',
    args: ['entry-id'],
    expected: { entityType: 'Entry', id: 'entry-id' }
  },
  {
    method: 'openEntry',
    args: ['entry-id', { slideIn: true }],
    expected: { entityType: 'Entry', id: 'entry-id', slideIn: true }
  },
  {
    method: 'openNewEntry',
    args: ['ct-id'],
    expected: { entityType: 'Entry', id: null, contentTypeId: 'ct-id' }
  },
  {
    method: 'openNewEntry',
    args: ['ct-id', { slideIn: true }],
    expected: { entityType: 'Entry', id: null, contentTypeId: 'ct-id', slideIn: true }
  },
  {
    method: 'openAsset',
    args: ['asset-id'],
    expected: { entityType: 'Asset', id: 'asset-id' }
  },
  {
    method: 'openAsset',
    args: ['asset-id', { slideIn: true }],
    expected: { entityType: 'Asset', id: 'asset-id', slideIn: true }
  },
  {
    method: 'openNewAsset',
    args: [],
    expected: { entityType: 'Asset', id: null }
  },
  {
    method: 'openNewAsset',
    args: [{ slideIn: true }],
    expected: { entityType: 'Asset', id: null, slideIn: true }
  },
  {
    method: 'openPageExtension',
    args: [],
    expected: { extensionId: 'test-id' },
    channelMethod: 'navigateToPageExtension'
  },
  {
    method: 'openPageExtension',
    args: [{ page: 'testPage' }],
    expected: { extensionId: 'test-id', page: 'testPage' },
    channelMethod: 'navigateToPageExtension'
  },
  {
    method: 'openPageExtension',
    args: [{ extensionId: 'another-id' }],
    expected: { extensionId: 'another-id' },
    channelMethod: 'navigateToPageExtension'
  },
  {
    method: 'openPageExtension',
    args: [{ extensionId: 'another-id', page: 'testPage' }],
    expected: { extensionId: 'another-id', page: 'testPage' },
    channelMethod: 'navigateToPageExtension'
  }
]

describe('createNavigator()', () => {
  describe('returned "navigator" object', () => {
    SCENARIOS.forEach(({ method, args, expected, channelMethod = 'navigateToContentEntity' }) => {
      describeChannelCallingMethod({
        creator: channelStub => createNavigator(channelStub, 'test-id'),
        methodName: method,
        channelMethod,
        args,
        expectedCallArgs: expected
      })
    })
  })
})
