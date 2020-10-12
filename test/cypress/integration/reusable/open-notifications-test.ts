export function verifySuccessNotification(iframeSelector: string) {
  const successMessage = 'Success message!'
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.notifier.success(successMessage)
  })
  cy.findByTestId('cf-ui-notification')
    .should('have.attr', 'data-intent', 'success')
    .and('contain', successMessage)
}

export function verifyErrorNotification(iframeSelector: string) {
  const errorMessage = 'Error message!'
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.notifier.error(errorMessage)
  })
  cy.findByTestId('cf-ui-notification')
    .should('have.attr', 'data-intent', 'error')
    .and('contain', errorMessage)
}

export function openSuccessNotificationTest(iframeSelector: string) {
  it('sdk.notifier.success method opens success notification', () => {
    verifySuccessNotification(iframeSelector)
  })
}

export function openErrorNotificationTest(iframeSelector: string) {
  it('sdk.notifier.error method opens error notification', () => {
    verifyErrorNotification(iframeSelector)
  })
}
