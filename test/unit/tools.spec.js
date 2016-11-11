import createTools from '../../lib/api/tools'
import { describeChannelCallingMethod } from '../helpers'

describe('createTools()', () => {
  describe('returned "tools" object', () => {
    describeChannelCallingMethod({
      creator: createTools,
      methodName: 'openEntitySelector',
      args: [{test: true}]
    })
  })
})
