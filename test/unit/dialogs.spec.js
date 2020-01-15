const { expect, describeChannelCallingMethod } = require('../helpers')

const createDialogs = require('../../lib/dialogs')

const SIMPLE_DIALOGS = [
  ['openAlert', 'alert'],
  ['openConfirm', 'confirm'],
  ['openPrompt', 'prompt']
]

const ENTITY_SELECTOR_DIALOGS = [
  ['selectSingleEntry', 'Entry', false],
  ['selectSingleAsset', 'Asset', false],
  ['selectMultipleEntries', 'Entry', true],
  ['selectMultipleAssets', 'Asset', true]
]

describe('createDialogs()', () => {
  describe('returned "dialogs" object', () => {
    SIMPLE_DIALOGS.forEach(([method, type]) => {
      describeChannelCallingMethod({
        creator: createDialogs,
        methodName: method,
        channelMethod: 'openDialog',
        args: [{ test: true }],
        expectedCallArgs: [type, { test: true }]
      })
    })

    ENTITY_SELECTOR_DIALOGS.forEach(([method, entityType, multiple]) => {
      describeChannelCallingMethod({
        creator: createDialogs,
        methodName: method,
        channelMethod: 'openDialog',
        args: [{ test: true }],
        expectedCallArgs: ['entitySelector', { test: true, entityType, multiple }]
      })
    })

    describeChannelCallingMethod({
      creator: channelStub => createDialogs(channelStub, { extension: 'test-id' }),
      methodName: 'openExtension',
      channelMethod: 'openDialog',
      args: [{ test: true }],
      expectedCallArgs: ['extension', { id: 'test-id', test: true }]
    })

    describeChannelCallingMethod({
      creator: channelStub => createDialogs(channelStub, { extension: 'test-id' }),
      methodName: 'openExtension',
      channelMethod: 'openDialog',
      args: [{ test: true, id: 'custom-test-id' }],
      expectedCallArgs: ['extension', { id: 'custom-test-id', test: true }]
    })

    describe('.openExtension()', () => {
      it('throws if no extension ID is provided (no ID option, app location)', () => {
        const dialogs = createDialogs({ call: () => {} }, { app: 'some-app-id' })

        expect(() => {
          dialogs.openExtension({ test: true })
        }).to.throw(/Extension ID not provided/)
      })
    })

    describeChannelCallingMethod({
      creator: channelStub => createDialogs(channelStub, { app: 'app-id' }),
      methodName: 'openCurrentApp',
      channelMethod: 'openDialog',
      args: [{ test: true }],
      expectedCallArgs: ['app', { id: 'app-id', test: true }]
    })

    describeChannelCallingMethod({
      creator: channelStub => createDialogs(channelStub, { app: 'app-id' }),
      methodName: 'openCurrentApp',
      channelMethod: 'openDialog',
      args: [{ test: true, id: 'try-to-overwrite' }],
      expectedCallArgs: ['app', { id: 'app-id', test: true }]
    })

    describe('.openCurrentApp()', () => {
      it('throws if not in app context', () => {
        const dialogs = createDialogs({ call: () => {} }, { extension: 'some-ext' })

        expect(() => {
          dialogs.openCurrentApp()
        }).to.throw(/Not in the app context/)
      })
    })
  })
})
