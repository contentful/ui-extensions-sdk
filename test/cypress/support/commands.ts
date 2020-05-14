import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      captureIFrameAs(value: string): Chainable<Subject>
      setAuthTokenToLocalStorage(): Chainable<Subject>
      waitForIframeWithTestId(selector: string): Chainable<Subject>
      waitForPageLoad(page: string, testId: string): Chainable<Subject>
      checkForIframe(selector): Chainable<Subject>
      captureIFrameAs(selector: string): Chainable<Subject>
      getSdk(selector: string): Chainable<any>
    }
  }
}

Cypress.Commands.add('captureIFrameAs', { prevSubject: 'element' }, ($element, as) => {
  const $body = $element.contents().find('body')
  cy.wrap($body).as(as)
})

Cypress.Commands.add('setAuthTokenToLocalStorage', function setAuthTokenToLocalStorage() {
  const TOKEN = Cypress.env('managementToken')
  window.localStorage.setItem('token', TOKEN)
  window.sessionStorage.setItem('token', TOKEN)
})

Cypress.Commands.add('waitForIframeWithTestId', function waitForIframe(testId) {
  cy.get('iframe').should($iframe => {
    expect($iframe.contents().find(`[data-test-id="${testId}"]`)).to.exist
  })
})

Cypress.Commands.add('getSdk', function(selector) {
  return cy
    .window()
    .then(win => {
      return win.document.querySelector(selector).contentWindow.window.sdk
    })
    .then(cy.wrap)
})
