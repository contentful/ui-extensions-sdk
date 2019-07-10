import { pageExtension } from '../../utils/paths'

export function openAndVerifyPageExtension(testId = 'open-page-extension-button') {
  cy.get('@extension')
    .find(`[data-test-id="${testId}"]`)
    .click()

  cy.url().should('eq', Cypress.config().baseUrl + pageExtension('test-extension'))
}
