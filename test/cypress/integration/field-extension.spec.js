import { entry } from '../utils/paths'

import { verifyPageExtensionUrl } from './reusable/open-page-extension-test'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

const selectors = {
  openPageExtensionButton: '[data-test-id="open-page-extension-button"]',
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

  it('opens page extension using sdk.navigator.openPageExtension', () => {
    cy.get('@extension')
      .find(selectors.openPageExtensionButton)
      .click()

    verifyPageExtensionUrl('test-extension')
  })
})
