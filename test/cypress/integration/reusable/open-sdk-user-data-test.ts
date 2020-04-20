import userData from '../fixtures/user-data.json'

export function verifySdkUserData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.user).to.deep.equal(userData)
  })
}

export function openSdkUserDataTest(iframeSelector) {
  it('sdk.user static methods have expected values', () => {
    verifySdkUserData(iframeSelector)
  })
}
