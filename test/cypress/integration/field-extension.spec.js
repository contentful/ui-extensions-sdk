import { entry } from '../utils/paths'

import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntryTest, openEntrySlideInTest } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'
import { openSdkLocalesDataTest } from './reusable/open-sdk-locales-data-test'

const post = {
  id: '1MDrvtuLDk0PcxS5nCkugC',
  title: 'My first post'
}

const iframeSelector = '[data-field-api-name="title"] iframe'
const idsData = require('./fixtures/ids-data.json')

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

  /* Reusable tests */

  openPageExtensionTest()
  openDialogExtensionTest(iframeSelector)
  openEntryTest()
  openEntrySlideInTest(post.id)
  openAssetTest()
  openAssetSlideInTest(post.id)
  openSdkUserDataTest(iframeSelector)
  openSdkLocalesDataTest(iframeSelector)
})
