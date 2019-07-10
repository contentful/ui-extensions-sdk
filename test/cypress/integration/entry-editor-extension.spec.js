import { entry } from '../utils/paths'

import { openAndVerifyPageExtension } from './reusable/open-page-extension-test'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: ''
}

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('.entry-editor iframe').captureIFrameAs('extension')
  })

  it('opens first post and checks that entry editor extension is rendered', () => {
    cy.get('@extension')
      .find('[data-test-id="title-field"]')
      .should('exist')
      .and('have.value', post.title)

    cy.get('@extension')
      .find('[data-test-id="body-field"]')
      .should('exist')
      .and('have.value', post.body)
  })
  it('opens page extension using sdk.navigator.openPageExtension', () => {
    openAndVerifyPageExtension()
  })
})
