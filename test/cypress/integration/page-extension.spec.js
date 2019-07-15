import { pageExtension } from '../utils/paths'

import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest } from './reusable/open-entry-test'

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(pageExtension('test-extension'))
    cy.waitForIFrame()
    cy.getByTestId('page-extension').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
    cy.get('@extension').within(() => {
      cy.getByTestId('my-page-extension').should('exist')
    })
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId('open-new-path-button').click()
    })

    cy.url().should('include', 'test-extension/new')
  })

  /* Reusable tests */

  openDialogExtensionTest()
  openEntryTest()
})
