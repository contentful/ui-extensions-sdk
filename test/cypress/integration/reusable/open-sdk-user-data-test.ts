import { User } from '../../../../lib/types'
import { removeVariableData } from '../../utils/remove-variable-data'
import { role } from '../../utils/role'
import userData from '../fixtures/user-data.json'

function verifySdkUserData(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    const actual = removeVariableData(sdk.user)
    const expected = removeVariableData(userData[role] as User)

    const actualKeys = Object.keys(actual)
    const expectedKeys = Object.keys(expected)

    expect(actualKeys).to.equal(expectedKeys)

    for (const key of actualKeys) {
      // @ts-expect-error We have no index access, but this gives better error reports
      expect(actual[key]).to.deep.equal(expected[key])
    }
  })
}

export function openSdkUserDataTest(iframeSelector: string) {
  it('sdk.user static methods have expected values', () => {
    verifySdkUserData(iframeSelector)
  })
}
