import { entry } from '../utils/paths'

import * as openPageExtensionTest from './reusable/open-page-extension-test'
import { openEntryTest } from './reusable/open-entry-test'
import { actionSelectors } from '../../constants'

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

    cy.getByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe')
        .should('have.length', 1)
        .captureIFrameAs('sidebarExtension')
    })

    cy.get('@sidebarExtension').within(() => {
      cy.getByTestId(actionSelectors.openDialogExtension).click()
    })

    cy.waitForIFrame()
    cy.getByTestId('cf-ui-modal').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens page extension using sdk.navigator.openPageExtension (with closing dialog)', () => {
    openPageExtensionTest.clickToOpenPageExtension()
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get('@extension').should('not.be.visible')
  })

  it('opens page extension using sdk.navigator.openPageExtension (without closing dialog)', () => {
    openPageExtensionTest.clickToOpenPageExtension(actionSelectors.openPageExtensionNoClose)
    openPageExtensionTest.verifyPageExtensionUrl()

    cy.get('@extension').should('be.visible')
  })

  /* Reusable */

  openEntryTest()
})
