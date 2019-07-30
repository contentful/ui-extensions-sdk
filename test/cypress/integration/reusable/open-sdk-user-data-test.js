const user = require('../fixtures/user-data.json')

export function verifySdkUserData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.user.email).to.equal(user.email)
    expect(sdk.user.firstName).to.equal(user.firstName)
    expect(sdk.user.lastName).to.equal(user.lastName)
    expect(sdk.user.spaceMembership.admin).to.equal(user.isAdmin)
    expect(sdk.user.spaceMembership.sys.id).to.equal(user.membershipId)
    expect(sdk.user.sys.id).to.equal(user.userId)
  })
}

export function openSdkUserDataTest(iframeSelector) {
  it('sdk.user static methods have expected values', () => {
    verifySdkUserData(iframeSelector)
  })
}
