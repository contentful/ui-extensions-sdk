import '@testing-library/cypress/add-commands'
import cachedContentTypes from '../integration/fixtures/cached-content-types'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      captureIFrameAs(value: string): Chainable<Subject>
      setAuthTokenToLocalStorage(): Chainable<Subject>
      waitForIFrame(): Chainable<Subject>
      waitForIframeWithTestId(selector: string): Chainable<Subject>
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

Cypress.Commands.add('waitForIFrame', function waitForIFrame() {
  // eslint-disable-next-line
  cy.wait(10000)
})

Cypress.Commands.add('iframeLoaded', { prevSubject: 'element' }, $iframe => {
  const contentWindow = $iframe.prop('contentWindow')
  return new Promise(resolve => {
    if (contentWindow && contentWindow.document.readyState === 'complete') {
      resolve(contentWindow)
    } else {
      $iframe.on('load', () => {
        resolve(contentWindow)
      })
    }
  })
})

Cypress.Commands.add('getInDocument', { prevSubject: 'document' }, (document, selector) =>
  Cypress.$(selector, document)
)

// Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
//   // For more info on targeting inside iframes refer to this GitHub issue:
//   // https://github.com/cypress-io/cypress/issues/136
//   cy.log('Getting iframe body')

//   return cy
//     .wrap($iframe)
//     .should(iframe => expect(iframe.contents().find('body')).to.exist)
//     .then(iframe => cy.wrap(iframe.contents().find('body')))
//     .within({}, callback)
// })

Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
  return new Cypress.Promise(resolve => {
    $iframe.on('load', () => {
      resolve($iframe)
    })
  })
})

Cypress.Commands.add('waitForIframeWithTestId', function waitForIframe(testId) {
  cy.get('iframe').should($iframe => {
    expect($iframe.contents().find(`[data-test-id="${testId}"]`)).to.exist
  })
})

Cypress.Commands.add('getSdk', function(selector) {
  return cy.window().then(win => {
    return win.document.querySelector(selector).contentWindow.window.sdk
  })
})
