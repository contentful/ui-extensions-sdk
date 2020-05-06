import { entry } from '../utils/paths'

import {
  openPageExtensionTest,
  openPageExtensionWithSubRoute
} from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest, openEntrySlideInTest } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import { checkSdkEntryDataTest } from './reusable/check-sdk-entry-data-test'
import { checkSdkSpaceMethods } from './reusable/check-sdk-space-methods-test'
import { checkSdkNavigationSlideInCallbackTest } from './reusable/check-sdk-navigation-slide-in-callback-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest
} from './reusable/open-notifications-test'
import { verifyLocation } from '../utils/verify-location'
import {
  verifySdkInstallationParameters,
  verifySdkInstanceParameters
} from '../utils/verify-parameters'
import idsData from './fixtures/ids-data.json'
import contentTypeData from './fixtures/content-type-data/field-ext.json'
import parameters from './fixtures/parameters.json'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

const iframeSelector = '[data-field-api-name="title"] iframe'
const iframePageSelector = '[data-test-id="page-extension"] iframe'
const fieldUiTestId = 'cf-ui-text-input'
// const pageExtensionTestId = 'my-page-extension'

context('Field extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id)).then(() => {
      cy.findByTestId('workbench-title').should($title => {
        expect($title).to.exist
      })

      cy.waitForIframeWithTestId(fieldUiTestId)
      cy.get(iframeSelector).captureIFrameAs('extension')
    })
  })

  it('verifies field extension is rendered and onIsDisabledChanged handler is called', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId('cf-ui-text-input')
        .should('exist')
        .and('not.have.attr', 'disabled')
    })
  })

  it('verifies sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.ids.contentType).to.equal(idsData.fieldExtension.contentType)
      expect(sdk.ids.entry).to.equal(idsData.fieldExtension.entry)
      expect(sdk.ids.field).to.equal(idsData.fieldExtension.field)
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

  it('verifies sdk.location.is entry-field', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      verifyLocation(sdk, 'entry-field')
    })
  })

  it('verifies sdk.parameters have expected values', () => {
    cy.getSdk(iframeSelector).then(() => {
      verifySdkInstallationParameters(iframeSelector)
      // for field extension custom instance parameter is set in UI.
      parameters.instance.instanceParameterEnumId = 'option2'
      verifySdkInstanceParameters(iframeSelector)
    })
  })

  it('verifies opened page extension contains path in sdk.parameteres.invocation)', () => {
    openPageExtensionWithSubRoute(iframeSelector)
    cy.waitForIFrame()
    cy.getSdk(iframePageSelector).then(sdk => {
      expect(sdk.parameters.invocation).to.deep.equal({ path: location.pathname })
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
  checkSdkEntryDataTest(iframeSelector)
  checkSdkSpaceMethods(iframeSelector)
  openSuccessNotificationTest(iframeSelector)
  openErrorNotificationTest(iframeSelector)
  checkSdkNavigationSlideInCallbackTest(iframeSelector)
})
