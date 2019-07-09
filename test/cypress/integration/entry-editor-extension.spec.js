import { entry } from '../utils/paths'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: ''
}

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
  })

  it('opens first post and checks that entry editor extension is rendered', () => {
    cy.visit(entry(post.id))

    cy.getByText(post.title).should('exist')

    // eslint-disable-next-line
    cy.wait(3000)

    cy.get('.entry-editor iframe').captureIFrameAs('extension')

    cy.get('@extension')
      .find('[data-test-id="title-field"]')
      .should('exist')
      .and('have.value', post.title)

    cy.get('@extension')
      .find('[data-test-id="body-field"]')
      .should('exist')
      .and('have.value', post.body)
  })
})
