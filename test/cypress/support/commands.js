Cypress.Commands.add('captureIFrameAs', { prevSubject: 'element' }, ($element, as) => {
  const $body = $element.contents().find('body')
  cy.wrap($body).as(as)
})

Cypress.Commands.add('setAuthTokenToLocalStorage', function setAuthTokenToLocalStorage() {
  const TOKEN = Cypress.env('cmaToken')
  window.sessionStorage.setItem('token', TOKEN)
})
