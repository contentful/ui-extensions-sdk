import { entry } from '../utils/paths'
import * as Constants from '../../constants'
import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest } from './reusable/open-entry-test'

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
      .find(`[data-test-id="${Constants.actionSelectors.sidebarButton}"]`)
      .should('exist')
  })

  /* Reusable tests */

  openPageExtensionTest()
  openDialogExtensionTest()
  openEntryTest()
  openEntrySlideInTest(post.id)
})
