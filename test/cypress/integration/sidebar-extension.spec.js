import { entry } from '../utils/paths'
import * as Constants from '../../constants'
import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import { openSdkEntryDataTest } from './reusable/open-sdk-entry-data-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest
} from './reusable/open-notifications-test'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

const iframeSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const idsData = require('./fixtures/ids-data.json')
const contentTypeData = require('./fixtures/content-type-data/sidebar-ext.json')

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()

    cy.getByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe')
        .should('have.length', 1)
        .captureIFrameAs('extension')
    })
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId(Constants.actionSelectors.sidebarButton).should('exist')
    })
  })

  it('sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.ids.contentType).to.equal(idsData.sidebarExtension.contentType)
      expect(sdk.ids.entry).to.equal(idsData.sidebarExtension.entry)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user)
    })
  })

  it('sdk.contentType static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      contentTypeData.sys.environment.sys.id = Cypress.env('activeEnvironmentId')
      expect(sdk.contentType).to.deep.equal(contentTypeData)
    })
  })

  it('verifies sdk.location.is entry-sidebar', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.location.is('entry-sidebar')).to.equal(true)
    })
  })

  /* Reusable tests */

  openPageExtensionTest(iframeSelector)
  openDialogExtensionTest(iframeSelector)
  openEntryTest(iframeSelector)
  openEntrySlideInTest(iframeSelector, post.id)
  openAssetTest(iframeSelector)
  openAssetSlideInTest(iframeSelector, post.id)
  openSdkUserDataTest(iframeSelector)
  openSdkLocalesDataTest(iframeSelector)
  openSdkEntryDataTest(iframeSelector)
  openSuccessNotificationTest(iframeSelector)
  openErrorNotificationTest(iframeSelector)
})
