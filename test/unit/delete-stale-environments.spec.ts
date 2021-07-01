import deleteStaleEnvironments from '../integration/tasks/delete-stale-environments'
import environmentMocks from '../mocks/environments'
import { expect } from '../helpers'
import { PlainClientAPI } from 'contentful-management'

describe('DeleteStaleEnvironments', () => {
  let plainClient: PlainClientAPI
  beforeEach(() => {
    plainClient = {
      environment: {
        getMany: () =>
          Promise.resolve({
            ...environmentMocks,
            items: environmentMocks.items.map((environment) => ({
              ...environment,
              delete: () => Promise.resolve(),
            })),
          }),
      },
    } as unknown as PlainClientAPI
  })

  it('should delete an environment that is older than one day and not a proteced environment', async () => {
    const expectedResult = ['Ndc5NB21mUxHVNdz5KvDO']
    expect(await deleteStaleEnvironments(plainClient)).to.eql(expectedResult)
  })
})
