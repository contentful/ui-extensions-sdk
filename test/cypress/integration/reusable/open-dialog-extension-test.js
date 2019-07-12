export function clickToOpenDialogExtension(
  selector = '[data-test-id="open-dialog-extension-button"]'
) {
  cy.get('@extension')
    .find(selector)
    .click()
}

export function checkThatDialogIsOpened(selector = '[data-test-id=cf-ui-modal]') {
  const dialogTitle = 'My awesome dialog extension'
  cy.get(selector)
    .should('exist')
    .and('contain', dialogTitle)
}

export function checkThatExtensionInDialogIsRendered(
  selector = '[data-test-id=cf-ui-modal] iframe',
  dialogSelector = '[data-test-id="my-dialog-extension"]'
) {
  cy.waitForIFrame()
  cy.get(selector).captureIFrameAs('dialogExtension')
  cy.get('@dialogExtension')
    .find(dialogSelector)
    .should('be.visible')
}

export function openDialogExtensionTest() {
  it('opens the dialog extension and checks it is rendered', () => {
    clickToOpenDialogExtension()
    checkThatDialogIsOpened()
    checkThatExtensionInDialogIsRendered()
  })
}
