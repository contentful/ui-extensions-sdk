import createDialogs from '../../lib/api/dialogs'
import { describeChannelCallingMethod } from '../helpers'

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
  })
})
