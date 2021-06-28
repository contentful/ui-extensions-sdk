import { removeVariableData } from '../../utils/remove-variable-data'
import expectedContentTypes from '../fixtures/cached-content-types'

export function verifySpaceGetCachedContentTypes(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    const cachedContentTypes = sdk.space.getCachedContentTypes()

    for (const ct of cachedContentTypes) {
      const expected = expectedContentTypes.find((i) => i.sys.id === ct.sys.id)!

      expect(removeVariableData(ct)).to.deep.equal(removeVariableData(expected))
    }
  })
}

export function checkSdkSpaceMethods(iframeSelector: string) {
  it('sdk.space.getCachedContentTypes returns an expected value', () => {
    verifySpaceGetCachedContentTypes(iframeSelector)
  })
}
