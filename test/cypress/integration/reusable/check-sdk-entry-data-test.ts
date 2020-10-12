import entryData from '../fixtures/entry-data.json'

export function verifySdkEntryData(iframeSelector: string) {
  cy.getSdk(iframeSelector).then(sdk => {
    const keys = Object.keys(sdk.entry.fields)
    keys.forEach(key => {
      ;['id', 'locales', 'type', 'required', 'validations'].forEach(property => {
        expect(sdk.entry.fields[key][property]).deep.equal((entryData as any).fields[key][property])
      })
    })
  })
}

export function checkSdkEntryDataTest(iframeSelector: string) {
  it('sdk.entry static methods have expected values', () => {
    verifySdkEntryData(iframeSelector)
  })
}
