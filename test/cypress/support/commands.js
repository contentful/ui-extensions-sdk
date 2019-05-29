export function setAuthTokenToLocalStorage() {
  const TOKEN = Cypress.env('token')
  window.sessionStorage.setItem('token', TOKEN)
}

Cypress.Commands.add('setAuthTokenToLocalStorage', setAuthTokenToLocalStorage)
