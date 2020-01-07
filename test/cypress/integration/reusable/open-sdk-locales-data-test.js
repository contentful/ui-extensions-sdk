const expectedLocaleData = {
  available: ['en-US', 'ru'],
  default: 'en-US',
  names: { 'en-US': 'English (United States)', ru: 'Russian' },
  fallbacks: {
    'en-US': undefined,
    ru: 'en-US'
  }
}

export function verifySdkLocalesData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.locales).to.deep.equal(expectedLocaleData)
  })
}

export function openSdkLocalesDataTest(iframeSelector) {
  it('sdk.locales static methods have expected values', () => {
    verifySdkLocalesData(iframeSelector)
  })
}
