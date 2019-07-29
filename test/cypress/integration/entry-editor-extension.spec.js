import { entry } from '../utils/paths'

import { openPageExtensionTest } from './reusable/open-page-extension-test'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { openEntrySlideInTest, openEntryTest } from './reusable/open-entry-test'
import { openAssetSlideInTest, openAssetTest } from './reusable/open-asset-test'
import { openSdkUserDataTest } from './reusable/open-sdk-user-data-test'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: 'body value'
}

const iframeSelector = '.entry-editor iframe'

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get('.entry-editor').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('opens page and checks that entry editor extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.getByTestId('title-field')
        .should('exist')
        .and('have.value', post.title)
    })

    cy.get('@extension').within(() => {
      cy.getByTestId('body-field')
        .should('exist')
        .and('have.value', post.body)
    })
  })

  /* Reusable tests */

  openPageExtensionTest()
  openDialogExtensionTest()
  openEntryTest()
  openEntrySlideInTest(post.id)
  openAssetTest()
  openAssetSlideInTest(post.id)
  openSdkUserDataTest(iframeSelector)
})
