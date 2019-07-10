import { entry } from '../utils/paths'

import { verifyPageExtensionUrl } from './reusable/open-page-extension-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

const selectors = {
  modalIFrame: '[data-test-id="cf-ui-modal"] iframe',
  sidebarIFrame: '[data-test-id="entry-editor-sidebar"] iframe',
  openDialogExtensionButton: '[data-test-id="open-dialog-extension-button"]',
  openPageExtensionButton: '[data-test-id="open-page-extension-button"]',
  openPageExtensionWithoutClosingButton:
    '[data-test-id="open-page-extension-button-without-closing"]'
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

    cy.get(selectors.modalIFrame)
    cy.waitForIFrame()
    cy.get(selectors.modalIFrame).captureIFrameAs('extension')
  })

  it('opens page extension using sdk.navigator.openPageExtension (with closing dialog)', () => {
    cy.get('@extension')
      .find(selectors.openPageExtensionButton)
      .click()

    verifyPageExtensionUrl()

    cy.get(selectors.modalIFrame).should('not.be.visible')
  })

  it('opens page extension using sdk.navigator.openPageExtension (without closing dialog)', () => {
    cy.get('@extension')
      .find(selectors.openPageExtensionWithoutClosingButton)
      .click()

    verifyPageExtensionUrl('test-extension')

    cy.get(selectors.modalIFrame).should('be.visible')
  })
})
