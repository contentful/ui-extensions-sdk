const localesData = require('../fixtures/locales-data.json')

export function verifySdkLocalesData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(JSON.stringify(sdk.locales)).to.equal(JSON.stringify(localesData))
  })
}

export function openSdkLocalesDataTest(iframeSelector) {
  it('sdk.locales static methods have expected values', () => {
    verifySdkLocalesData(iframeSelector)
  })
}
