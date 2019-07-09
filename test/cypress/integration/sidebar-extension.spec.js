import { entry } from '../utils/paths'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.visit(entry(post.id))

    cy.getByText(post.title).should('exist')

    // eslint-disable-next-line
    cy.wait(3000)

    cy.get('[data-test-id="entry-editor-sidebar"] iframe').should('have.length', 1)

    cy.get('[data-test-id="entry-editor-sidebar"] iframe').captureIFrameAs('extension')

    cy.get('@extension')
      .find('[data-test-id="sidebar-button"]')
      .should('exist')
  })
})
