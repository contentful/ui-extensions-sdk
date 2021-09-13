import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest } from './reusable/open-entry-test'
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
import { widgetLocation } from '../../constants'

const post = {
  id: Cypress.env('entries').entryEditorExtension,
  title: 'My post with a custom entry editor',
  body: 'body value',
}

const iframeSelector = '[data-test-id="cf-ui-workbench-content"] iframe'
const entryExtensionSelector = 'cf-ui-card'

context(`Entry editor extension (${role})`, () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    cy.visitEntryWithRetry(post.id)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(entryExtensionSelector, widgetLocation.entryEditor)
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('verify that entry editor extension is rendered and onIsDisabledChanged handler is called', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId('title-field')
        .should('exist')
        .and('have.value', post.title)
        .and('not.have.attr', 'disabled')
    })

    cy.get('@extension').within(() => {
      cy.findByTestId('body-field')
        .should('exist')
        .and('have.value', post.body)
        .and('not.have.attr', 'disabled')
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
