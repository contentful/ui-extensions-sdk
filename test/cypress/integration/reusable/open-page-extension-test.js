import { pageExtension } from '../../utils/paths'
import { actionSelectors } from '../../../constants'

export function clickToOpenPageExtension(
  selector = `[data-test-id="${actionSelectors.openPageExtension}"]`
) {
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
