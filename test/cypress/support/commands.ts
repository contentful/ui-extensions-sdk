import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      captureIFrameAs(selector: string): Chainable<Subject>
      setupBrowserStorage(): Chainable<Subject>
      waitForIframeWithTestId(selector: string): Chainable<Subject>
      waitForPageLoad(page: string, testId: string): Chainable<Subject>
      getSdk(selector: string): Chainable<any>
    }
  }
}

Cypress.Commands.add('captureIFrameAs', { prevSubject: 'element' }, ($element, as) => {
  const $body = $element.contents().find('body')
  cy.wrap($body).as(as)
})

Cypress.Commands.add('setupBrowserStorage', function setupBrowserStorage() {
  const TOKEN = Cypress.env('managementToken')
  window.localStorage.setItem('token', TOKEN)
  window.sessionStorage.setItem('token', TOKEN)
  window.localStorage.setItem('__disable_consentmanager', 'yes')
})

Cypress.Commands.add('waitForIframeWithTestId', function waitForIframe(testId) {
  cy.get('iframe').should(($iframe) => {
    expect($iframe.contents().find(`[data-test-id="${testId}"]`)).to.exist
  })
})

Cypress.Commands.add('getSdk', function (selector) {
  return cy
    .window()
    .then((win) => {
      return win.document.querySelector(selector).contentWindow.window.sdk
    })
    .then(cy.wrap)
})
