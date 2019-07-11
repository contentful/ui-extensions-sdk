import { entry } from '../utils/paths'

import { verifyPageExtensionUrl } from './reusable/open-page-extension-test'

const post = {
  id: '5mwUiJB2kThfAG9ZnRNuNQ',
  title: 'My post with a custom entry editor',
  body: 'body value'
}

const selectors = {
  entryIFrame: '.entry-editor iframe',
  openPageExtensionButton: '[data-test-id="open-page-extension-button"]',
  openDialogExtensionButton: '[data-test-id="open-dialog-extension-button"]',
  titleField: '[data-test-id="title-field"]',
  bodyField: '[data-test-id="body-field"]',
  modalIFrame: '[data-test-id="cf-ui-modal"] iframe',
  dialogExtension: '[data-test-id="my-dialog-extension"]'
}

context('Entry editor extension', () => {
  beforeEach(() => {
    cy.setAuthTokenToLocalStorage()
    cy.visit(entry(post.id))
    cy.getByText(post.title).should('exist')
    cy.waitForIFrame()
    cy.get(selectors.entryIFrame).captureIFrameAs('extension')
  })

  it('opens first post and checks that entry editor extension is rendered', () => {
    cy.get('@extension')
      .find(selectors.titleField)
      .should('exist')
      .and('have.value', post.title)

    cy.get('@extension')
      .find(selectors.bodyField)
      .should('exist')
      .and('have.value', post.body)
  })
  it('opens page extension using sdk.navigator.openPageExtension', () => {
    cy.get('@extension')
      .find(selectors.openPageExtensionButton)
      .click()

    verifyPageExtensionUrl('test-extension')
  })

  it('opens the dialog extension and checks it is rendered', () => {
    const dialogTitle = 'My awesome dialog extension'
    cy.get('@extension')
      .find(selectors.openDialogExtensionButton)
      .click()
    cy.get('[data-test-id=cf-ui-modal]')
      .should('exist')
      .and('contain', dialogTitle)
    cy.waitForIFrame()
    cy.get(selectors.modalIFrame).captureIFrameAs('dialogExtension')
    cy.get('@dialogExtension')
      .find(selectors.dialogExtension)
      .should('be.visible')
  })
})
