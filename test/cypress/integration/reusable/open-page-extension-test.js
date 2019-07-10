import { pageExtension } from '../../utils/paths'

export function verifyPageExtensionUrl(extensionId = 'test-extension') {
  cy.url().should('eq', Cypress.config().baseUrl + pageExtension(extensionId))
}
