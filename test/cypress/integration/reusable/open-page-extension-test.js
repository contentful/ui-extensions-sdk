import { pageExtension } from '../../utils/paths'

export function clickToOpenPageExtension(selector = '[data-test-id="open-page-extension-button"]') {
  cy.get('@extension')
    .find(selector)
    .click()
}

export function verifyPageExtensionUrl(extensionId = 'test-extension') {
  cy.url().should('eq', Cypress.config().baseUrl + pageExtension(extensionId))
}

export function openPageExtensionTest() {
  it('opens page extension using sdk.navigator.openPageExtension', () => {
    clickToOpenPageExtension()
    verifyPageExtensionUrl()
  })
}
