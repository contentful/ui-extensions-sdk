import deleteStaleAliases from '../integration/tasks/delete-stale-aliases'
import aliasMock from '../mocks/aliases'
import { expect } from '../helpers'

describe('DeleteStaleAliases', () => {
  let currentSpace: any
  beforeEach(() => {
    currentSpace = () =>
      Promise.resolve({
        getEnvironmentAliases: () =>
          Promise.resolve({
            ...aliasMock,
            items: aliasMock.items.map((alias) => ({
              ...alias,
              delete: () => Promise.resolve(),
            })),
          }),
      })
  })

  it('should delete an alias that is older than one day and not a protected alias', async () => {
    const expectedResult = ['old']
    expect(await deleteStaleAliases(currentSpace)).to.eql(expectedResult)
  })
})
