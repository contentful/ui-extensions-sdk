import userData from '../fixtures/user-data.json'

export function verifySdkUserData(iframeSelector: string) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.user).to.deep.equal(userData)
  })
}

export function openSdkUserDataTest(iframeSelector: string) {
  it('sdk.user static methods have expected values', () => {
    verifySdkUserData(iframeSelector)
  })
}
