import { expect } from 'chai'
import { createDeferred } from '../../../lib/utils/deferred'

describe('isFulfilled', () => {
  it('should be `false` before calling `resolve`', () => {
    const deferred = createDeferred()
    expect(deferred).to.eq(false)
  })

  it('should be `true` after calling `resolve`', () => {
    const deferred = createDeferred()
    deferred.resolve('yolo')
    expect(deferred).to.eq(true)
  })
})
