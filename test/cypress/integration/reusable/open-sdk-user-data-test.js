const userData = require('../fixtures/user-data.json')

export function verifySdkUserData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(JSON.stringify(sdk.user)).to.equal(JSON.stringify(userData))
  })
}

export function openSdkUserDataTest(iframeSelector) {
  it('sdk.user static methods have expected values', () => {
    verifySdkUserData(iframeSelector)
  })
}
