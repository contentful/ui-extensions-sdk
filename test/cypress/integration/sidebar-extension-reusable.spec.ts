import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest, visitEntry } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import { checkSdkEntryDataTest } from './reusable/check-sdk-entry-data-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest,
} from './reusable/open-notifications-test'
import { role } from '../utils/role'

const post = {
  id: Cypress.env('entries').sidebarExtension,
  title: 'My post with a custom sidebar',
}

const iframeSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const sidebarExtension = 'cf-ui-sidebar-extension'

context(`Sidebar extension (${role})`, () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    visitEntry(post.id)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(sidebarExtension)

    cy.findByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe').should('have.length', 1).captureIFrameAs('extension')
    })
  })

  /* Reusable tests */
  openPageExtensionTest(iframeSelector)
  openDialogExtensionTest(iframeSelector)
  openEntryTest(iframeSelector)
  openEntrySlideInTest(iframeSelector, post.id)
  openAssetTest(iframeSelector)
  openAssetSlideInTest(iframeSelector, post.id)
  openSdkUserDataTest(iframeSelector)
  openSdkLocalesDataTest(iframeSelector)
  checkSdkEntryDataTest(iframeSelector)
  openSuccessNotificationTest(iframeSelector)
  openErrorNotificationTest(iframeSelector)
})
