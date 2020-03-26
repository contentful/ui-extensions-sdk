const deleteStaleEnvironments = require('../integration/tasks/delete-stale-environments')
const environmentMocks = require('../mocks/environments')
const { expect } = require('../helpers')

describe('DeleteStaleEnvironments', () => {
  let currentSpace
  beforeEach(() => {
    currentSpace = () =>
      Promise.resolve({
        getEnvironments: () =>
          Promise.resolve({
            ...environmentMocks,
            items: environmentMocks.items.map(environment => ({
              ...environment,
              delete: () => Promise.resolve()
            }))
          })
      })
  })

  it('should delete an environment that is older than one day and not a proteced environment', async () => {
    const expectedResult = ['Ndc5NB21mUxHVNdz5KvDO']
    expect(await deleteStaleEnvironments(currentSpace)).to.eql(expectedResult)
  })
})
