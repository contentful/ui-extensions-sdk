Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
  return new Cypress.Promise(resolve => {
    const $body = $iframe.contents().find('body')
    resolve($body)
  })
})

Cypress.Commands.add('setAuthTokenToLocalStorage', function setAuthTokenToLocalStorage() {
  const TOKEN = Cypress.env('cmaToken')
  window.sessionStorage.setItem('token', TOKEN)
})
