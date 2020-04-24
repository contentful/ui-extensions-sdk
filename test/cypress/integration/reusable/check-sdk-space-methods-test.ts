import cachedContentTypes from '../fixtures/cached-content-types'

export function verifySpaceGetCachedContentTypes(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.space.getCachedContentTypes()).to.deep.equal(cachedContentTypes)
  })
}

export function checkSdkSpaceMethods(iframeSelector) {
  it('sdk.space.getCachedContentTypes returns an expected value', () => {
    verifySpaceGetCachedContentTypes(iframeSelector)
  })
}
