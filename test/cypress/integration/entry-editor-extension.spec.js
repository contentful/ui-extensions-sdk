import { entry } from '../utils/paths'

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
import { verifyLocation } from '../utils/verify-location'
import {
  verifySdkInstallationParameters,
  verifySdkInstanceParameters
} from '../utils/verify-parameters'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: 'body value'
}

const iframeSelector = '.entry-editor iframe'
const idsData = require('./fixtures/ids-data.json')
const contentTypeData = require('./fixtures/content-type-data/entry-editor-ext.json')

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.findByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('.entry-editor').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens page and checks that entry editor extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId('title-field')
        .should('exist')
        .and('have.value', post.title)
    })

    cy.get('@extension').within(() => {
      cy.findByTestId('body-field')
        .should('exist')
        .and('have.value', post.body)
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
    cy.getSdk(iframeSelector).then(sdk => {
      verifySdkInstallationParameters(iframeSelector)
      verifySdkInstanceParameters(iframeSelector)
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
