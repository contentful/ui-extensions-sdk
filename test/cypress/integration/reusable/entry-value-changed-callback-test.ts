export function entryValueChangedCallbackTest(iframeSelector: any) {
  it('verifies on valueChanged is called when value changes', () => {
    cy.getSdk(iframeSelector).then(async (sdk) => {
      const spy = cy.stub()
      sdk.entry.fields.body.onValueChanged(spy)
      expect(spy).to.be.calledOnce
      expect(spy).to.be.calledWith('body value')
    })
  })
}
