import { entiriesList } from '../utils/paths'

context('Simple test', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
  })

  it('visit empty entries list', () => {
    cy.visit(entiriesList())
    cy.getByTestId('no-content-type-advice')
      .queryByText('It all starts with a brilliant content model')
      .should('exist')
  })
})
