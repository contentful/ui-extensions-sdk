import { role } from '../utils/role'
import { verifyLocation } from '../utils/verify-location'
import {
  verifySdkInstallationParameters,
  verifySdkInvocationParameters,
} from '../utils/verify-parameters'
import idsData from './fixtures/ids-data.json'
import { openDialogExtension } from './reusable/open-dialog-extension-test'
import * as openPageExtensionTest from './reusable/open-page-extension-test'

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
      cy.waitForIframeWithTestId(dialogExtension, 'dialog')
      cy.get('iframe').as('dialogExtension')
    })
  })

  it('opens page extension using sdk.navigator.openPageExtension (with closing dialog)', () => {
    openPageExtensionTest.openPageExtension(iframeDialogSelector)
    cy.getSdk(iframeDialogSelector).then((sdk) => {
      sdk.close()
    })
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get('@dialogExtension').should('not.exist')
  })

  it('opens page extension using sdk.navigator.openPageExtension (without closing dialog)', () => {
    openPageExtensionTest.openPageExtension(iframeDialogSelector)
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get('@dialogExtension').should('be.exist')
  })

  it('verifies sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeDialogSelector).then((sdk) => {
      expect(sdk.ids.contentType).to.equal(undefined)
      expect(sdk.ids.entry).to.equal(undefined)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user[role])
    })
  })

  it('verifies sdk.location.is dialog', () => {
    cy.getSdk(iframeDialogSelector).then((sdk) => {
      verifyLocation(sdk, 'dialog')
    })
  })

  it('verifies sdk.parameters have expected values', () => {
    cy.getSdk(iframeDialogSelector).then(() => {
      verifySdkInstallationParameters(iframeDialogSelector)
      verifySdkInvocationParameters(iframeDialogSelector)
    })
  })
})
