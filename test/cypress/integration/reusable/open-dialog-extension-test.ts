import { actionSelectors } from '../../../constants'

export function openDialogExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.dialogs.openExtension({
      title: 'My awesome dialog extension',
      parameters: { test: true, value: 'invocation-parameter' }
    })
  })
}

export function checkThatDialogIsOpened() {
  const dialogTitle = 'My awesome dialog extension'
  cy.findByTestId('cf-ui-modal')
    .should('exist')
    .and('contain', dialogTitle)
}

export function checkThatExtensionInDialogIsRendered(testId = actionSelectors.dialogWrapper) {
  cy.waitForIframeWithTestId(actionSelectors.dialogWrapper)
  cy.findByTestId('cf-ui-modal').within(() => {
    cy.get('iframe').captureIFrameAs('dialogExtension')
  })
  cy.get('@dialogExtension').within(() => {
    cy.findByTestId(testId).should('be.visible')
  })
}

export function openDialogExtensionTest(iframeSelector) {
  it('opens the dialog extension and checks it is rendered', () => {
    openDialogExtension(iframeSelector)
    checkThatDialogIsOpened()
    checkThatExtensionInDialogIsRendered()
  })
}
