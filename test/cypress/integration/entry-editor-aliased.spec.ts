import { entryAliased } from '../utils/paths'
import { role } from '../utils/role'

const post = {
  id: Cypress.env('entries').onValueChanged,
  title: 'My post to test onValueChanged',
  body: 'body value',
}

const iframeSelector = '[data-test-id="cf-ui-workbench-content"] iframe'
const entryExtensionSelector = 'cf-ui-card'

context(`Aliased Entry editor extension (${role})`, () => {
  beforeEach(() => {
    const spaceId = Cypress.env('activeSpaceId')
    cy.setupBrowserStorage()
    cy.intercept({
      method: 'GET',
      url: `/spaces/${spaceId}/environments/*/content_types`,
    }).as('contentTypesRequest')
    cy.intercept({
      method: 'GET',
      url: `spaces/${spaceId}/environments/*/entries`,
    }).as('entriesRequest')
  })

  it('verifies that API calls use the active Alias', () => {
    cy.visit(entryAliased(post.id))
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(entryExtensionSelector)
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
    const aliasId = Cypress.env('activeAliasId')

    cy.getSdk(iframeSelector).then(async (sdk) => {
      sdk.space.getContentTypes()
      sdk.space.getEntries()

      cy.wait('@contentTypesRequest').its('request.url').should('include', aliasId)
      cy.wait('@entriesRequest').its('request.url').should('include', aliasId)
    })
  })

  it('verifies that when not using alias API calls does not use the active Alias', () => {
    const aliasId = Cypress.env('activeAliasId')
    cy.visitEntryWithRetry(post.id)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(entryExtensionSelector)
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })

    cy.getSdk(iframeSelector).then(async (sdk) => {
      sdk.space.getContentTypes()
      sdk.space.getEntries()

      cy.wait('@contentTypesRequest').its('request.url').should('not.include', aliasId)
      cy.wait('@entriesRequest').its('request.url').should('not.include', aliasId)
    })
  })
})
