import { entry } from '../utils/paths'

import * as openPageExtensionTest from './reusable/open-page-extension-test'
import { openEntryTest } from './reusable/open-entry-test'
import { actionSelectors } from '../../constants'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

const selectors = {
  modalIFrame: '[data-test-id="cf-ui-modal"] iframe',
  sidebarIFrame: '[data-test-id="entry-editor-sidebar"] iframe',
  openDialogExtensionButton: `[data-test-id="${actionSelectors.openDialogExtension}"]`
}

context('Dialog extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get(selectors.sidebarIFrame).should('have.length', 1)
    cy.get(selectors.sidebarIFrame).captureIFrameAs('sidebarExtension')

    cy.get('@sidebarExtension')
      .find(selectors.openDialogExtensionButton)
      .click()

    cy.waitForIFrame()
    cy.get(selectors.modalIFrame).captureIFrameAs('extension')
  })

  it('opens page extension using sdk.navigator.openPageExtension (with closing dialog)', () => {
    openPageExtensionTest.clickToOpenPageExtension()
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get(selectors.modalIFrame).should('not.be.visible')
  })

  it('opens page extension using sdk.navigator.openPageExtension (without closing dialog)', () => {
    openPageExtensionTest.clickToOpenPageExtension(
      `[data-test-id="${actionSelectors.openPageExtensionNoClose}"]`
    )
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get(selectors.modalIFrame).should('be.visible')
  })

  /* Reusable */

  openEntryTest()
})
