import { entry } from '../utils/paths'
import * as Constants from '../../constants'
import { role } from '../utils/role'
import { verifyLocation } from '../utils/verify-location'
import {
  verifySdkInstallationParameters,
  verifySdkInstanceParameters,
} from '../utils/verify-parameters'
import idsData from './fixtures/ids-data.json'
import contentTypeData from './fixtures/content-type-data/sidebar-ext.json'

const post = {
  id: Cypress.env('entries').sidebarExtension,
  title: 'My post with a custom sidebar',
}

const iframeSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const sidebarExtension = 'cf-ui-sidebar-extension'

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    cy.visit(entry(post.id))
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(sidebarExtension)

    cy.findByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe').should('have.length', 1).captureIFrameAs('extension')
    })
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId(Constants.actionSelectors.sidebarButton).should('exist')
    })
  })

  it('verifies sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeSelector).then((sdk) => {
      expect(sdk.ids.contentType).to.equal(idsData.sidebarExtension.contentType)
      expect(sdk.ids.entry).to.equal(post.id)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user[role])
    })
  })

  it('verifies sdk.contentType static methods have expected values', () => {
    cy.getSdk(iframeSelector).then((sdk) => {
      contentTypeData.sys.environment.sys.id = Cypress.env('activeEnvironmentId')
      expect(sdk.contentType).to.deep.equal(contentTypeData)
    })
  })

  it('verifies sdk.location.is entry-sidebar', () => {
    cy.getSdk(iframeSelector).then((sdk) => {
      verifyLocation(sdk, 'entry-sidebar')
    })
  })

  it('verifies sdk.parameters have expected values', () => {
    cy.getSdk(iframeSelector).then(() => {
      verifySdkInstallationParameters(iframeSelector)
      verifySdkInstanceParameters(iframeSelector)
    })
  })
})
