const { describeChannelCallingMethod } = require('../helpers')

const createSpace = require('../../lib/space')

const spaceMethods = [
  'getContentType',
  'getEntry',
  'getEntrySnapshots',
  'getAsset',
  'getEditorInterface',

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

  'createUpload',
  'processAsset',
  'waitUntilAssetProcessed',

  'getUsers'
]

describe('createSpace()', () => {
  describe('returned "space" object', () => {
    spaceMethods.forEach(spaceMethod => {
      const args = ['foo', 42, {}]
      describeChannelCallingMethod({
        creator: createSpace,
        methodName: spaceMethod,
        channelMethod: 'callSpaceMethod',
        args: args,
        expectedCallArgs: [spaceMethod, args]
      })
    })
  })
})
