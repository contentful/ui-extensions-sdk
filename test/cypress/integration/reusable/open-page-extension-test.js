import { pageExtension } from '../../utils/paths'

export function openPageExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openPageExtension()
  })
}

export function openPageExtensionWithSubRoute(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openPageExtension({ path: location.pathname })
  })
}

export function verifyPageExtensionUrl(extensionId = 'test-extension') {
  cy.url().should('eq', Cypress.config().baseUrl + pageExtension(extensionId))
}

export function openPageExtensionTest(iframeSelector) {
  it('opens page extension using sdk.navigator.openPageExtension', () => {
    openPageExtension(iframeSelector)
    verifyPageExtensionUrl()
  })
}
