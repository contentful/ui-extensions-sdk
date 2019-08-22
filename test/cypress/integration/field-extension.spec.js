import { entry } from '../utils/paths'

import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest, openEntrySlideInTest } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'
import { openSdkEntryDataTest } from './reusable/open-sdk-entry-data-test'
import {
  openSuccessNotificationTest,
  openErrorNotificationTest
} from './reusable/open-notifications-test'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

const iframeSelector = '[data-field-api-name="title"] iframe'
const idsData = require('./fixtures/ids-data.json')
const contentTypeData = require('./fixtures/content-type-data/field-ext.json')

context('Field extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get(iframeSelector).captureIFrameAs('extension')
  })

  it('field extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId('cf-ui-text-input').should('exist')
    })
  })

  it('sdk.ids static methods have expected values', () => {
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

  it('sdk.contentType static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      contentTypeData.sys.environment.sys.id = Cypress.env('activeEnvironmentId')
      expect(sdk.contentType).to.deep.equal(contentTypeData)
    })
  })

  it('verifies sdk.location.is entry-field', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.location.is('entry-field')).to.equal(true)
      expect(sdk.location.is('dialog')).to.equal(false)
      expect(sdk.location.is('entry-editor')).to.equal(false)
      expect(sdk.location.is('page')).to.equal(false)
      expect(sdk.location.is('entry-sidebar')).to.equal(false)
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
