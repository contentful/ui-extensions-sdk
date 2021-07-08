import { actionSelectors } from '../../constants'
import { pageExtension } from '../utils/paths'
import { role } from '../utils/role'
import { openDialogExtensionTest } from './reusable/open-dialog-extension-test'
import { AssertionError } from 'chai'

context.only(`Initialize (${role})`, () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
  })

  it('Entry Editor', () => {
    throw new AssertionError('ERRROR')

    cy.visitEntryWithRetry(Cypress.env('entries').entryEditorExtension)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId('cf-ui-card')
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })

    cy.get('@extension').within(() => {
      cy.findByTestId('title-field').should('exist').and('not.have.attr', 'disabled')
    })
  })

  it('Field Extension', () => {
    cy.visitEntryWithRetry(Cypress.env('entries').fieldExtension)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId('cf-ui-text-input')
    cy.get('[data-field-api-name="title"] iframe').captureIFrameAs('extension')

    cy.get('@extension').within(() => {
      cy.findByTestId('cf-ui-text-input').should('exist').and('not.have.attr', 'disabled')
    })
  })

  it('Sidebar Extension', () => {
    cy.visitEntryWithRetry(Cypress.env('entries').sidebarExtension)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId('cf-ui-sidebar-extension')

    cy.findByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe').should('have.length', 1).captureIFrameAs('sidebarExtension')
    })

    cy.get('@sidebarExtension').within(() => {
      cy.findByTestId(actionSelectors.sidebarButton).should('be.visible')
    })
  })

  it('Page Extension', () => {
    cy.visit(pageExtension('test-extension'))

    cy.findByTestId('page-extension').within(() => {
      cy.waitForIframeWithTestId('my-page-extension')
      cy.get('iframe').captureIFrameAs('pageExtension')
    })

    cy.get('@pageExtension').within(() => {
      cy.findByTestId('my-page-extension').should('exist')
    })
  })

  describe('Dialog Extension', () => {
    beforeEach(() => {
      cy.visitEntryWithRetry(Cypress.env('entries').sidebarExtension)
      cy.findByTestId('workbench-title').should(($title) => {
        expect($title).to.exist
      })

      cy.waitForIframeWithTestId('cf-ui-sidebar-extension')

      cy.findByTestId('entry-editor-sidebar').within(() => {
        cy.get('iframe').should('have.length', 1).captureIFrameAs('sidebarExtension')
      })
    })

    openDialogExtensionTest('[data-test-id="entry-editor-sidebar"] iframe')
  })
})
