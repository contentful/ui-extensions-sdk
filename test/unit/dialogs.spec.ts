import { describeChannelCallingMethod } from '../helpers'

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
      creator: (channelStub: Channel) => createDialogs(channelStub, { app: 'app-id' } as any),
      methodName: 'open',
      channelMethod: 'openDialog',
      args: [{ test: true }],
      expectedCallArgs: ['app', { id: 'app-id', test: true }],
    })

    describeChannelCallingMethod({
      creator: (channelStub: Channel) => createDialogs(channelStub, { app: 'app-id' } as any),
      methodName: 'open',
      channelMethod: 'openDialog',
      args: [{ test: true, id: 'try-to-overwrite' }],
      expectedCallArgs: ['app', { id: 'app-id', test: true }],
    })
  })
})
