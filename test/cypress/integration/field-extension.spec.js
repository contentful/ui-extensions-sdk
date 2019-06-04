import { entiriesList } from '../utils/paths'

context('Field extension', () => {
  beforeEach(() => {
    cy.server()
    cy.route('**/channel/**', [])
    cy.route('POST', '**/channel/**', [])
    cy.setAuthTokenToLocalStorage()
  })

  it('opens first post and checks that field extension is rendered', () => {
    cy.visit(entiriesList())
    cy.getAllByTestId('entry-row')
      .first()
      .click()

    // eslint-disable-next-line
    cy.wait(3000)

    cy.get('[data-field-api-name="title"] iframe').then($element => {
      const $body = $element.contents().find('body')
      cy.wrap($body).as('extension')
    })

    cy.get('@extension')
      .find('[data-test-id="cf-ui-text-input"]')
      .should('exist')
  })
})
