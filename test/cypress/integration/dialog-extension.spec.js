import { entry } from '../utils/paths'

import * as openPageExtensionTest from './reusable/open-page-extension-test'
import { openEntryTest } from './reusable/open-entry-test'
import { openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openDialogExtension } from './reusable/open-dialog-extension-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

const iframeSidebarSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const iframeDialogSelector = '[data-test-id="cf-ui-modal"] iframe'
const idsData = require('./fixtures/ids-data.json')

context('Dialog extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()

    cy.getByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe')
        .should('have.length', 1)
        .captureIFrameAs('sidebarExtension')
    })

    openDialogExtension(iframeSidebarSelector)
    cy.waitForIFrame()
    cy.getByTestId('cf-ui-modal').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens page extension using sdk.navigator.openPageExtension (with closing dialog)', () => {
    openPageExtensionTest.openPageExtension(iframeDialogSelector)
    cy.getSdk(iframeDialogSelector).then(sdk => {
      sdk.close()
    })
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get('@extension').should('not.be.visible')
  })

  it('opens page extension using sdk.navigator.openPageExtension (without closing dialog)', () => {
    openPageExtensionTest.openPageExtension(iframeDialogSelector)
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get('@extension').should('be.visible')
  })

  it('sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeDialogSelector).then(sdk => {
      expect(sdk.ids.contentType).to.equal(undefined)
      expect(sdk.ids.entry).to.equal(undefined)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user)
    })
  })

  /* Reusable */

  openEntryTest(iframeDialogSelector)
  openAssetTest(iframeDialogSelector)
  openSdkUserDataTest(iframeDialogSelector)
  openSdkLocalesDataTest(iframeDialogSelector)
})
