import { entry } from '../utils/paths'
import { verifyLocation } from '../utils/verify-location'
import {
  verifySdkInstallationParameters,
  verifySdkInstanceParameters
} from '../utils/verify-parameters'
import idsData from './fixtures/ids-data.json'
import contentTypeData from './fixtures/content-type-data/entry-editor-ext.json'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: 'body value'
}

const iframeSelector = '[data-test-id="cf-ui-workbench-content"] iframe'
const entryExtensionSelector = 'cf-ui-card'

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.findByTestId('workbench-title').should($title => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(entryExtensionSelector)
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('verify that entry editor extension is rendered and onIsDisabledChanged handler is called', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId('title-field')
        .should('exist')
        .and('have.value', post.title)
        .and('not.have.attr', 'disabled')
    })

    cy.get('@extension').within(() => {
      cy.findByTestId('body-field')
        .should('exist')
        .and('have.value', post.body)
        .and('not.have.attr', 'disabled')
    })
  })

  it('verifies sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.ids.contentType).to.equal(idsData.entryEditorExtension.contentType)
      expect(sdk.ids.entry).to.equal(idsData.entryEditorExtension.entry)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user)
    })
  })

  it('verifies sdk.contentType static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      contentTypeData.sys.environment.sys.id = Cypress.env('activeEnvironmentId')
      expect(sdk.contentType).to.deep.equal(contentTypeData)
    })
  })

  it('verifies sdk.location.is entry-editor', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      verifyLocation(sdk, 'entry-editor')
    })
  })

  it('verifies sdk.parameters have expected values', () => {
    cy.getSdk(iframeSelector).then(() => {
      verifySdkInstallationParameters(iframeSelector)
      verifySdkInstanceParameters(iframeSelector)
    })
  })
})
