const entryData = require('../fixtures/entry-data.json')

export function verifySdkEntryData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.entry.fields).to.have.property('title')
    expect(sdk.entry.fields).to.have.property('body')
    expect(sdk.entry.fields.title.id).to.equal(entryData.fields.title.id)
    expect(sdk.entry.fields.title.locales).to.contain(entryData.fields.title.locales[0])
    expect(sdk.entry.fields.title.type).to.contain(entryData.fields.title.type)
    expect(sdk.entry.fields.title.required).to.equal(true)
    expect(sdk.entry.fields.title.validations).to.have.length(0)
    expect(sdk.entry.fields.body.id).to.equal(entryData.fields.body.id)
    expect(sdk.entry.fields.body.locales).to.contain(entryData.fields.body.locales[0])
    expect(sdk.entry.fields.body.type).to.equal(entryData.fields.body.type)
    expect(sdk.entry.fields.body.required).to.equal(false)
    expect(sdk.entry.fields.body.validations).to.have.length(0)
  })
}

export function openSdkEntryDataTest(iframeSelector) {
  it('sdk.entry static methods have expected values', () => {
    verifySdkEntryData(iframeSelector)
  })
}
