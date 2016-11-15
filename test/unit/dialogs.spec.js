import createDialogs from '../../lib/api/dialogs'
import { describeChannelCallingMethod } from '../helpers'

const methods = [
  ['selectSingleEntry', 'Entry', false],
  ['selectSingleAsset', 'Asset', false],
  ['selectMultipleEntries', 'Entry', true],
  ['selectMultipleAssets', 'Asset', true]
]

describe('createDialogs()', () => {
  describe('returned "dialogs" object', () => {
    methods.forEach(([method, entityType, multiple]) => {
      const callOptions = {test: true, entityType, multiple}
      describeChannelCallingMethod({
        creator: createDialogs,
        methodName: method,
        channelMethod: 'openDialog',
        args: [{test: true}],
        expectedCallArgs: ['entitySelector', callOptions]
      })
    })
  })
})
