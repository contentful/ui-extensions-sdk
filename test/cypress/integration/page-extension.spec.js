import { pageExtension } from '../utils/paths'

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.visit(pageExtension('test-extension'))

    // eslint-disable-next-line
    cy.wait(3000)

    cy.get('[data-test-id="page-extension"] iframe').captureIFrameAs('extension')

    cy.get('@extension')
      .find('[data-test-id="cf-ui-page-extension"]')
      .should('exist')

    cy.get('@extension')
      .find('button:first')
      .click()

    cy.url().should('include', 'test-extension/new')
  })
})
