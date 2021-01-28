import { pageExtension, pageExtensionMaster } from '../../utils/paths'
import { role } from '../../utils/role'

export function openPageExtension(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    sdk.navigator.openPageExtension()
  })
}

export function openPageExtensionWithSubRoute(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    sdk.navigator.openPageExtension({ path: location.pathname })
  })
}

export function verifyPageExtensionUrl(extensionId = 'test-extension') {
  const allowedPageExtensionUrls = [Cypress.config().baseUrl + pageExtension(extensionId)]

  if (role === 'editorMasterOnly') {
    allowedPageExtensionUrls.push(Cypress.config().baseUrl + pageExtensionMaster(extensionId))
  }

  cy.url().should('be.oneOf', allowedPageExtensionUrls)
}

export function openPageExtensionTest(iframeSelector: string) {
  it('opens page extension using sdk.navigator.openPageExtension', () => {
    openPageExtension(iframeSelector)
    verifyPageExtensionUrl()
  })
}
