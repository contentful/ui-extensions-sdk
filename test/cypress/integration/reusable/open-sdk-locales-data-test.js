const localesData = require('../fixtures/locales-data.json')

export function verifySdkLocalesData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.locales).to.deep.equal(localesData)
  })
}

export function openSdkLocalesDataTest(iframeSelector) {
  it('sdk.locales static methods have expected values', () => {
    verifySdkLocalesData(iframeSelector)
  })
}
