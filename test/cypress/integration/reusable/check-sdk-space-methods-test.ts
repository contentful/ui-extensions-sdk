import { ContentType } from '../../../../lib/types'
import { removeVariableData } from '../../utils/remove-variable-data'
import expectedContentTypes from '../fixtures/cached-content-types'

export function verifySpaceGetCachedContentTypes(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    const cachedContentTypes: ContentType[] = sdk.space.getCachedContentTypes()

    for (const expected of expectedContentTypes) {
      const ct = cachedContentTypes.find((i) => i.sys.id === expected.sys.id)!

      expect(removeVariableData(ct)).to.deep.equal(removeVariableData(expected))
    }
  })
}

export function checkSdkSpaceMethods(iframeSelector: string) {
  it('sdk.space.getCachedContentTypes returns an expected value', () => {
    verifySpaceGetCachedContentTypes(iframeSelector)
  })
}
