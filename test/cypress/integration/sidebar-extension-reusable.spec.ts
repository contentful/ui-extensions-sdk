import { entry } from '../utils/paths'
import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import { checkSdkEntryDataTest } from './reusable/check-sdk-entry-data-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest
} from './reusable/open-notifications-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

const iframeSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const sidebarExtension = 'cf-ui-sidebar-extension'

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setupBrowserStorage()

    cy.visit(entry(post.id))
    cy.findByTestId('workbench-title').should($title => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(sidebarExtension)

    cy.findByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe')
        .should('have.length', 1)
        .captureIFrameAs('extension')
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
