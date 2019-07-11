import { pageExtension } from '../utils/paths'

const selectors = {
  pageIFrame: '[data-test-id="page-extension"] iframe',
  page: '[data-test-id="my-page-extension"]',
  openNewPathButton: '[data-test-id="open-new-path-button"]',
  openDialogExtensionButton: '[data-test-id="open-dialog-extension-button"]',
  modalIFrame: '[data-test-id="cf-ui-modal"] iframe',
  dialogExtension: '[data-test-id="my-dialog-extension"]'
}

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(pageExtension('test-extension'))
    cy.waitForIFrame()
    cy.get(selectors.pageIFrame).captureIFrameAs('extension')
    cy.get('@extension')
      .find(selectors.page)
      .should('exist')
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.get('@extension')
      .find(selectors.openNewPathButton)
      .click()

    cy.url().should('include', 'test-extension/new')
  })

  it('opens the dialog extension and checks it is rendered', () => {
    const dialogTitle = 'My awesome dialog extension'

    cy.get('@extension')
      .find(selectors.openDialogExtensionButton)
      // Doesn't work even when is done manually
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
