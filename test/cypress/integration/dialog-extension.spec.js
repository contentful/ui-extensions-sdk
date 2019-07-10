import { entry } from '../utils/paths'

import { openAndVerifyPageExtension } from './reusable/open-page-extension-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

context('Dialog extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('[data-test-id="entry-editor-sidebar"] iframe').should('have.length', 1)
    cy.get('[data-test-id="entry-editor-sidebar"] iframe').captureIFrameAs('sidebarExtension')

    cy.get('@sidebarExtension')
      .find('[data-test-id="open-dialog-extension-button"]')
      .click()

    cy.get('[data-test-id="cf-ui-modal"] iframe')
    cy.waitForIFrame()
    cy.get('[data-test-id="cf-ui-modal"] iframe').captureIFrameAs('extension')
  })

  it('opens page extension using sdk.navigator.openPageExtension (with closing dialog)', () => {
    openAndVerifyPageExtension()
    cy.get('[data-test-id="cf-ui-modal"]').should('not.exist')
  })

  it('opens page extension using sdk.navigator.openPageExtension (without closing dialog)', () => {
    openAndVerifyPageExtension()
    cy.get('[data-test-id="cf-ui-modal"]').should('exist')
  })
})
