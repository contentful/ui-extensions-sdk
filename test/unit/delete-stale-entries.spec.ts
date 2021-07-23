import deleteStaleEntries from '../integration/tasks/delete-stale-entries'
import entryMocks from '../mocks/entries'
import { expect } from '../helpers'
import { PlainClientAPI } from 'contentful-management'

describe('DeleteStaleEntries', () => {
  let plainClient: PlainClientAPI
  beforeEach(() => {
    plainClient = {
      entry: {
        getMany: () => Promise.resolve(entryMocks),
        delete: () => Promise.resolve(),
      },
    } as unknown as PlainClientAPI
  })

  it('should delete an entry that is older than one day', async () => {
    const expectedResult = ['b4ltnOQh2HkAFBZVMzdz7']
    expect(await deleteStaleEntries(plainClient)).to.eql(expectedResult)
  })
})
