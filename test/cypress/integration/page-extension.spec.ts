import { pageExtension } from '../utils/paths'
import { verifyLocation } from '../utils/verify-location'
import { verifySdkInstallationParameters } from '../utils/verify-parameters'
import idsData from './fixtures/ids-data.json'

const iframeSelector = '[data-test-id="page-extension"] iframe'
const pageExtensionId = 'my-page-extension'

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(pageExtension('test-extension'))

    cy.findByTestId('page-extension').within(() => {
      cy.waitForIframeWithTestId(pageExtensionId)
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId('my-page-extension').should('exist')
    })

    cy.get('@extension').within(() => {
      cy.findByTestId('open-new-path-button').click()
    })

    cy.url().should('include', 'test-extension/new')
  })

  it('verifies sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.ids.contentType).to.equal(undefined)
      expect(sdk.ids.entry).to.equal(undefined)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user)
    })
  })

  it('verifies sdk.location.is page', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      verifyLocation(sdk, 'page')
    })
  })

  it('verifies sdk.parameters.installation has expected values', () => {
    cy.getSdk(iframeSelector).then(() => {
      verifySdkInstallationParameters(iframeSelector)
    })
  })

  it('verifies sdk.parameters.invocation has expected default value', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.parameters.invocation).to.deep.equal({ path: '' })
    })
  })
})
