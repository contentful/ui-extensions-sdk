import { entry } from '../utils/paths'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

context('Field extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
  })

  it('opens first post and checks that field extension is rendered', () => {
    cy.visit(entry(post.id))

    cy.getByText(post.title).should('exist')

    // eslint-disable-next-line
    cy.wait(3000)

    cy.get('[data-field-api-name="title"] iframe').captureIFrameAs('extension')

    cy.get('@extension')
      .find('[data-test-id="cf-ui-text-input"]')
      .should('exist')
  })
})
