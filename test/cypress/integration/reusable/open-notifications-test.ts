export function verifySuccessNotification(iframeSelector) {
  const successMessage = 'Success message!'
  cy.getSdk(iframeSelector)
    .then(sdk => {
      sdk.notifier.success(successMessage)
    })
    .then(() => {
      cy.findByTestId('cf-ui-notification')
        .should('have.attr', 'data-intent', 'success')
        .and('contain', successMessage)
    })
}

export function verifyErrorNotification(iframeSelector) {
  const errorMessage = 'Error message!'
  cy.getSdk(iframeSelector)
    .then(sdk => {
      sdk.notifier.error(errorMessage)
    })
    .then(() => {
      cy.findByTestId('cf-ui-notification')
        .should('have.attr', 'data-intent', 'error')
        .and('contain', errorMessage)
    })
}

export function openSuccessNotificationTest(iframeSelector) {
  it('sdk.notifier.success method opens success notification', () => {
    verifySuccessNotification(iframeSelector)
  })
}

export function openErrorNotificationTest(iframeSelector) {
  it('sdk.notifier.error method opens error notification', () => {
    verifyErrorNotification(iframeSelector)
  })
}
