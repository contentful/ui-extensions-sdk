import { pageExtension } from '../utils/paths'

import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest } from './reusable/open-entry-test'
import { openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest
} from './reusable/open-notifications-test'
import { verifyLocation } from '../utils/verify-location'
import { verifySdkInstallationParameters } from '../utils/verify-parameters'

const iframeSelector = '[data-test-id="page-extension"] iframe'
const idsData = require('./fixtures/ids-data.json')

context('Page extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(pageExtension('test-extension'))
    cy.getByTestId('page-extension').within(() => {
      cy.waitForIFrame()
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens a page extension and tests navigating within the page', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId('my-page-extension').should('exist')
    })

    cy.get('@extension').within(() => {
      cy.getByTestId('open-new-path-button').click()
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
    cy.getSdk(iframeSelector).then(sdk => {
      verifySdkInstallationParameters(iframeSelector)
    })
  })

  it('verifies sdk.parameters.invocation has expected default value', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.parameters.invocation).to.deep.equal({ path: '/' })
    })
  })

  /* Reusable tests */

  openDialogExtensionTest(iframeSelector)
  openEntryTest(iframeSelector)
  openAssetTest(iframeSelector)
  openSdkUserDataTest(iframeSelector)
  openSdkLocalesDataTest(iframeSelector)
  openSuccessNotificationTest(iframeSelector)
  openErrorNotificationTest(iframeSelector)
})
