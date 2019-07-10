import { entry } from '../utils/paths'

import { verifyPageExtensionUrl } from './reusable/open-page-extension-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('[data-test-id="entry-editor-sidebar"] iframe').should('have.length', 1)
    cy.get('[data-test-id="entry-editor-sidebar"] iframe').captureIFrameAs('extension')
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.get('@extension')
      .find('[data-test-id="sidebar-button"]')
      .should('exist')
  })

  it('opens page extension using sdk.navigator.openPageExtension', () => {
    cy.get('@extension')
      .find('[data-test-id="open-page-extension-button"]')
      .click()

    verifyPageExtensionUrl('test-extension')
  })
})
