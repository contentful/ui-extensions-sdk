const expectedLocaleData = {
  available: ['en-US', 'ru'],
  default: 'en-US',
  names: { 'en-US': 'English (United States)', ru: 'Russian' },
  fallbacks: {
    'en-US': undefined,
    ru: 'en-US'
  },
  optional: {
    'en-US': false,
    ru: true
  },
  direction: {
    'en-US': 'ltr',
    ru: 'ltr'
  }
}

export function verifySdkLocalesData(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(sdk.locales.available).to.deep.equal(expectedLocaleData.available)
    expect(sdk.locales.names).to.deep.equal(expectedLocaleData.names)
    expect(sdk.locales.fallbacks).to.deep.equal(expectedLocaleData.fallbacks)
    expect(sdk.locales.optional).to.deep.equal(expectedLocaleData.optional)
    expect(sdk.locales.direction).to.deep.equal(expectedLocaleData.direction)
    expect(sdk.locales.default).to.equal(expectedLocaleData.default)
  })
}

export function openSdkLocalesDataTest(iframeSelector) {
  it('sdk.locales static methods have expected values', () => {
    verifySdkLocalesData(iframeSelector)
  })
}
