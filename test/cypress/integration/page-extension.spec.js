import { pageExtension } from '../utils/paths'

import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest } from './reusable/open-entry-test'
import { openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'

const iframeSelector = '[data-test-id="page-extension"] iframe'

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(pageExtension('test-extension'))
    cy.getByTestId('page-extension').within(() => {
      cy.waitForIFrame()
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId('my-page-extension').should('exist')
    })

    cy.get('@extension').within(() => {
      cy.getByTestId('open-new-path-button').click()
    })

    cy.url().should('include', 'test-extension/new')
  })

  /* Reusable tests */

  openDialogExtensionTest(iframeSelector)
  openEntryTest()
  openAssetTest()
  openSdkUserDataTest(iframeSelector)
})
