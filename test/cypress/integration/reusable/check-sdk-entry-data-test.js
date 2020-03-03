const entryData = require('../fixtures/entry-data.json')

export function verifySdkEntryData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    const keys = Object.keys(sdk.entry.fields)
    keys.forEach(key => {
      ;['id', 'locales', 'type', 'required', 'validations'].forEach(property => {
        expect(sdk.entry.fields[key][property]).deep.equal(entryData.fields[key][property])
      })
    })
  })
}

export function checkSdkEntryDataTest(iframeSelector) {
  it('sdk.entry static methods have expected values', () => {
    verifySdkEntryData(iframeSelector)
  })
}
