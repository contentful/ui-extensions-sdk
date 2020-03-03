const entryData = require('../fixtures/entry-data.json')

export function verifySdkEntryData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.entry.fields).to.deep.equal(entryData.fields)
  })
}

export function checkSdkEntryDataTest(iframeSelector) {
  it('sdk.entry static methods have expected values', () => {
    verifySdkEntryData(iframeSelector)
  })
}
