import { entry } from '../utils/paths'

import { openAndVerifyPageExtension } from './reusable/open-page-extension-test'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

context('Field extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('[data-field-api-name="title"] iframe').captureIFrameAs('extension')
  })

  it('field extension is rendered', () => {
    cy.get('@extension')
      .find('[data-test-id="cf-ui-text-input"]')
      .should('exist')
  })

  it('opens page extension using sdk.navigator.openPageExtension', () => {
    openAndVerifyPageExtension()
  })
})
