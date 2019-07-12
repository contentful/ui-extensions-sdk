import { pageExtension } from '../utils/paths'

import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'

const selectors = {
  pageIFrame: '[data-test-id="page-extension"] iframe',
  page: '[data-test-id="my-page-extension"]',
  openNewPathButton: '[data-test-id="open-new-path-button"]'
}

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(pageExtension('test-extension'))
    cy.waitForIFrame()
    cy.get(selectors.pageIFrame).captureIFrameAs('extension')
    cy.get('@extension')
      .find(selectors.page)
      .should('exist')
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.get('@extension')
      .find(selectors.openNewPathButton)
      .click()

    cy.url().should('include', 'test-extension/new')
  })

  /* Reusable tests */

  openDialogExtensionTest()
})
