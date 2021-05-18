import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest, openEntrySlideInTest, visitEntry } from './reusable/open-entry-test'
import { openAssetTest, openAssetSlideInTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import { checkSdkEntryDataTest } from './reusable/check-sdk-entry-data-test'
import { checkSdkSpaceMethods } from './reusable/check-sdk-space-methods-test'
import { checkSdkNavigationSlideInCallbackTest } from './reusable/check-sdk-navigation-slide-in-callback-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest,
} from './reusable/open-notifications-test'
import { role } from '../utils/role'

const post = {
  id: Cypress.env('entries').fieldExtension,
  title: 'My first post',
}

const iframeSelector = '[data-field-api-name="title"] iframe'
const fieldUiTestId = 'cf-ui-text-input'

context(`Field extension (${role})`, () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    visitEntry(post.id)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(fieldUiTestId)
    cy.get(iframeSelector).captureIFrameAs('extension')
  })

  it('verifies field extension is rendered and onIsDisabledChanged handler is called', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId('cf-ui-text-input').should('exist').and('not.have.attr', 'disabled')
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
  checkSdkSpaceMethods(iframeSelector)
  openSuccessNotificationTest(iframeSelector)
  openErrorNotificationTest(iframeSelector)
  checkSdkNavigationSlideInCallbackTest(iframeSelector)
})
