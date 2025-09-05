import { expect, describeChannelCallingMethod } from '../helpers'

import createDialogs from '../../lib/dialogs'
import { Channel } from '../../lib/channel'

const SIMPLE_DIALOGS = [
  ['openAlert', 'alert'],
  ['openConfirm', 'confirm'],
  ['openPrompt', 'prompt'],
]

const ENTITY_SELECTOR_DIALOGS: [string, string, boolean][] = [
  ['selectSingleEntry', 'Entry', false],
  ['selectSingleAsset', 'Asset', false],
  ['selectMultipleEntries', 'Entry', true],
  ['selectMultipleAssets', 'Asset', true],
  ['selectSingleExperience', 'Experience', false],
  ['selectMultipleExperiences', 'Experience', true],
  ['selectSinglePattern', 'Pattern', false],
  ['selectMultiplePatterns', 'Pattern', true],
  ['selectSingleComponentDefinition', 'ComponentDefinition', false],
  ['selectMultipleComponentDefinitions', 'ComponentDefinition', true],
]

describe('createDialogs()', () => {
  describe('returned "dialogs" object', () => {
    SIMPLE_DIALOGS.forEach(([method, type]) => {
      describeChannelCallingMethod({
        creator: createDialogs,
        methodName: method,
        channelMethod: 'openDialog',
        args: [{ test: true }],
        expectedCallArgs: [type, { test: true }],
      })
    })

    ENTITY_SELECTOR_DIALOGS.forEach(([method, entityType, multiple]) => {
      describeChannelCallingMethod({
        creator: createDialogs,
        methodName: method,
        channelMethod: 'openDialog',
        args: [{ test: true }],
        expectedCallArgs: ['entitySelector', { test: true, entityType, multiple }],
      })
    })

    describeChannelCallingMethod({
      creator: (channelStub: Channel) =>
        createDialogs(channelStub, { extension: 'test-id' } as any),
      methodName: 'openExtension',
      channelMethod: 'openDialog',
      args: [{ test: true }],
      expectedCallArgs: ['extension', { id: 'test-id', test: true }],
    })

    describeChannelCallingMethod({
      creator: (channelStub: Channel) =>
        createDialogs(channelStub, { extension: 'test-id' } as any),
      methodName: 'openExtension',
      channelMethod: 'openDialog',
      args: [{ test: true, id: 'custom-test-id' }],
      expectedCallArgs: ['extension', { id: 'custom-test-id', test: true }],
    })

    describe('.openExtension()', () => {
      it('throws if no extension ID is provided (no ID option, app location)', () => {
        const dialogs = createDialogs({ call: () => {} } as any, { app: 'some-app-id' } as any)

        expect(() => {
          dialogs.openExtension({ test: true } as any)
        }).to.throw(/Extension ID not provided/)
      })
    })

    describeChannelCallingMethod({
      creator: (channelStub: Channel) => createDialogs(channelStub, { app: 'app-id' } as any),
      methodName: 'openCurrentApp',
      channelMethod: 'openDialog',
      args: [{ test: true }],
      expectedCallArgs: ['app', { id: 'app-id', test: true }],
    })

    describeChannelCallingMethod({
      creator: (channelStub: Channel) => createDialogs(channelStub, { app: 'app-id' } as any),
      methodName: 'openCurrentApp',
      channelMethod: 'openDialog',
      args: [{ test: true, id: 'try-to-overwrite' }],
      expectedCallArgs: ['app', { id: 'app-id', test: true }],
    })

    describe('.openCurrentApp()', () => {
      it('throws if not in app context', () => {
        const dialogs = createDialogs({ call: () => {} } as any, { extension: 'some-ext' } as any)

        expect(() => {
          dialogs.openCurrentApp()
        }).to.throw(/Not in the app context/)
      })
    })
  })
})
