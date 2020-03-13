const { describeChannelCallingMethod } = require('../helpers')

const createScheduledActions = require('../../lib/scheduledActions')

const SCENARIOS = [
  {
    method: 'getEntityScheduledActions',
    args: ['Entry', 'entry-id'],
    expected: { entityType: 'Entry', entityId: 'entry-id', method: 'getEntityScheduledActions' }
  },
  {
    method: 'getEntityScheduledActions',
    args: ['Asset', 'asset-id'],
    expected: { entityType: 'Asset', entityId: 'asset-id', method: 'getEntityScheduledActions' }
  }
]

describe('createScheduledActions()', () => {
  describe('returned "navigator" object', () => {
    SCENARIOS.forEach(({ method, args, expected, channelMethod = 'callScheduleActions' }) => {
      describeChannelCallingMethod({
        creator: channelStub => createScheduledActions(channelStub),
        methodName: method,
        channelMethod,
        args,
        expectedCallArgs: expected
      })
    })
  })
})
