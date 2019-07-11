import { entry } from '../utils/paths'

import { verifyPageExtensionUrl } from './reusable/open-page-extension-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}
const selectors = {
  openDialogExtensionButton: '[data-test-id="open-dialog-extension-button"]',
  modalIFrame: '[data-test-id="cf-ui-modal"] iframe',
  dialogExtension: '[data-test-id="my-dialog-extension"]'
}

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('[data-test-id="entry-editor-sidebar"] iframe').should('have.length', 1)
    cy.get('[data-test-id="entry-editor-sidebar"] iframe').captureIFrameAs('extension')
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.get('@extension')
      .find('[data-test-id="sidebar-button"]')
      .should('exist')
  })

  it('opens page extension using sdk.navigator.openPageExtension', () => {
    cy.get('@extension')
      .find('[data-test-id="open-page-extension-button"]')
      .click()

    verifyPageExtensionUrl('test-extension')
  })

  it('opens the dialog extension and checks it is rendered', () => {
    const dialogTitle = 'My awesome dialog extension'
    cy.get('@extension')
      .find(selectors.openDialogExtensionButton)
      .click()
    cy.get('[data-test-id=cf-ui-modal]')
      .should('exist')
      .and('contain', dialogTitle)
    cy.waitForIFrame()
    cy.get(selectors.modalIFrame).captureIFrameAs('dialogExtension')
    cy.get('@dialogExtension')
      .find(selectors.dialogExtension)
      .should('be.visible')
  })
})
