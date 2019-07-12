import { entry } from '../utils/paths'

import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

const selectors = {
  fieldIFrame: '[data-field-api-name="title"] iframe',
  input: '[data-test-id="cf-ui-text-input"]'
}

context('Field extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get(selectors.fieldIFrame).captureIFrameAs('extension')
  })

  it('field extension is rendered', () => {
    cy.get('@extension')
      .find(selectors.input)
      .should('exist')
  })

  /* Reusable tests */

  openPageExtensionTest()
  openDialogExtensionTest()
})
