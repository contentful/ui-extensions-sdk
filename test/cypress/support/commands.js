export function setAuthTokenToLocalStorage() {
  const TOKEN = Cypress.env('cmaToken')
  window.sessionStorage.setItem('token', TOKEN)
}

Cypress.Commands.add('setAuthTokenToLocalStorage', setAuthTokenToLocalStorage)
