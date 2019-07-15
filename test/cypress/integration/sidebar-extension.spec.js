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

    cy.getByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe')
        .should('have.length', 1)
        .captureIFrameAs('extension')
    })
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId(Constants.actionSelectors.sidebarButton).should('exist')
    })
  })

  /* Reusable tests */

  openPageExtensionTest()
  openDialogExtensionTest()
  openEntryTest()
  openEntrySlideInTest(post.id)
})
