import { entry } from '../utils/paths'

import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest } from './reusable/open-entry-test'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: 'body value'
}

const selectors = {
  entryIFrame: '.entry-editor iframe',
  titleField: '[data-test-id="title-field"]',
  bodyField: '[data-test-id="body-field"]'
}

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get(selectors.entryIFrame).captureIFrameAs('extension')
  })

  it('opens page and checks that entry editor extension is rendered', () => {
    cy.get('@extension')
      .find(selectors.titleField)
      .should('exist')
      .and('have.value', post.title)

    cy.get('@extension')
      .find(selectors.bodyField)
      .should('exist')
      .and('have.value', post.body)
  })

  /* Reusable tests */

  openPageExtensionTest()
  openDialogExtensionTest()
  openEntryTest()
  openEntrySlideInTest(post.id)
})
