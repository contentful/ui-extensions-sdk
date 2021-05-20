import { openEntryTest } from './reusable/open-entry-test'
import { openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openDialogExtension } from './reusable/open-dialog-extension-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest,
} from './reusable/open-notifications-test'
import { role } from '../utils/role'

const post = {
  id: Cypress.env('entries').sidebarExtension,
  title: 'My post with a custom sidebar',
}

const iframeSidebarSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const iframeDialogSelector = '[data-test-id="cf-ui-modal"] iframe'
const sidebarExtension = 'cf-ui-sidebar-extension'
const dialogExtension = 'my-dialog-extension'

context(`Dialog extension (${role})`, () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    cy.visitEntryWithRetry(post.id)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(sidebarExtension)

    cy.findByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe').should('have.length', 1).captureIFrameAs('sidebarExtension')
    })

    openDialogExtension(iframeSidebarSelector)

    cy.findByTestId('cf-ui-modal').within(() => {
      cy.waitForIframeWithTestId(dialogExtension)
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  /* Reusable Test */

  openEntryTest(iframeDialogSelector)
  openAssetTest(iframeDialogSelector)
  openSdkUserDataTest(iframeDialogSelector)
  openSdkLocalesDataTest(iframeDialogSelector)
  openSuccessNotificationTest(iframeDialogSelector)
  openErrorNotificationTest(iframeDialogSelector)
})
