import { actionSelectors } from '../../../constants'

export function clickToOpenDialogExtension(testId = actionSelectors.openDialogExtension) {
  cy.get('@extension').within(() => {
    cy.getByTestId(testId).click()
  })
}

export function checkThatDialogIsOpened() {
  const dialogTitle = 'My awesome dialog extension'
  cy.getByTestId('cf-ui-modal')
    .should('exist')
    .and('contain', dialogTitle)
}

export function checkThatExtensionInDialogIsRendered(testId = actionSelectors.dialogWrapper) {
  cy.waitForIFrame()
  cy.getByTestId('cf-ui-modal').within(() => {
    cy.get('iframe').captureIFrameAs('dialogExtension')
  })
  cy.get('@dialogExtension').within(() => {
    cy.getByTestId(testId).should('be.visible')
  })
}

export function openDialogExtensionTest(iframeSelector) {
  it('opens the dialog extension and checks it is rendered', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      sdk.dialogs.openExtension({
        title: 'My awesome dialog extension'
      })
    })
    checkThatDialogIsOpened()
    checkThatExtensionInDialogIsRendered()
  })
}
