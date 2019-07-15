import { pageExtension } from '../../utils/paths'
import { actionSelectors } from '../../../constants'

export function clickToOpenPageExtension(testId = actionSelectors.openPageExtension) {
  cy.get('@extension').within(() => {
    cy.getByTestId(testId).click()
  })
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
