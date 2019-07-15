import { actionSelectors } from '../../../constants'

export function clickToOpenDialogExtension(
  selector = `[data-test-id="${actionSelectors.openDialogExtension}"]`
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
  dialogWrapper = `[data-test-id="${actionSelectors.dialogWrapper}"]`
) {
  cy.waitForIFrame()
  cy.get(selector).captureIFrameAs('dialogExtension')
  cy.get('@dialogExtension')
    .find(dialogWrapper)
    .should('be.visible')
}

export function openDialogExtensionTest() {
  it('opens the dialog extension and checks it is rendered', () => {
    clickToOpenDialogExtension()
    checkThatDialogIsOpened()
    checkThatExtensionInDialogIsRendered()
  })
}
