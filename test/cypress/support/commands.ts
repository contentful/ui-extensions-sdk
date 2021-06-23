import '@testing-library/cypress/add-commands'
import { entry } from '../utils/paths'

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
  const UI_VERSION = Cypress.env('uiVersion')
  if (UI_VERSION) {
    cy.setCookie('ui_version', UI_VERSION)
  }
  window.sessionStorage.setItem('token', TOKEN)
  window.localStorage.setItem('__disable_consentmanager', 'yes')
})

Cypress.Commands.add('waitForIframeWithTestId', function waitForIframe(testId) {
  cy.get('iframe').should(($iframe) => {
    expect($iframe.contents().find(`[data-test-id="${testId}"]`)).to.exist
  })
})

Cypress.Commands.add('visitEntryWithRetry', function visitEntryWithRetry(id) {
  let statusCode: null | number = null
  cy.visit(entry(id))
  cy.intercept('GET', /entries/, (req) => {
    req.on('response', (res) => {
      statusCode = res.statusCode
    })
  }).as('getEntry')
  cy.wait('@getEntry').then(() => {
    // revisit on 429 error
    if (statusCode === 429) {
      cy.wait(1000)
      cy.visit(entry(id))
    }
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
