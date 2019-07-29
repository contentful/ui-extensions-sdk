import '@testing-library/cypress/add-commands'

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
  cy.wait(4000)
})

Cypress.Commands.add('getSdk', function(selector) {
  return cy.window().then(win => {
    return win.document.querySelector(selector).contentWindow.window.sdk
  })
})
