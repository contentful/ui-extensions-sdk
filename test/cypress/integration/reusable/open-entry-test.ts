import { entry } from '../../utils/paths'
import * as Constants from '../../../constants'

export function openEntryExtension(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    sdk.navigator.openEntry(Constants.entries.testImageWrapper)
  })
}

export function openEntrySlideInExtension(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    sdk.navigator.openEntry(Constants.entries.testImageWrapper, {
      slideIn: true,
    })
  })
}

export function visitEntry(id: string, noRetry?: boolean) {
  cy.visit(entry(id))

  if (!noRetry) {
    // retry when there was an error on loading the entry
    cy.findByTestId('slide-in-base').then((base) => {
      cy.intercept('GET', /entries/).as('getEntry')
      cy.wait('@getEntry')
      // check if there an error rendered in the ui
      const hasError = base.find('div').find(`[data-test-id="emptystate-error"]`).length
      if (hasError) {
        cy.wait(1000)
        visitEntry(id, true)
      }
    })
  }
}

export function verifyEntryPageUrl(entryId: string) {
  cy.url().should('eq', Cypress.config().baseUrl + entry(entryId))
}

export function verifyEntrySlideInUrl(entryId: string, previousEntryId: string) {
  cy.url().should(
    'eq',
    Cypress.config().baseUrl + entry(entryId) + `?previousEntries=${previousEntryId}`
  )
}

export function openEntryTest(iframeSelector: string) {
  it('opens entry using sdk.navigator.openEntry', () => {
    openEntryExtension(iframeSelector)
    verifyEntryPageUrl(Constants.entries.testImageWrapper)
  })
}

export function openEntrySlideInTest(iframeSelector: string, currentEntryId: string) {
  it('opens entry using sdk.navigator.openEntry (slideIn)', () => {
    openEntrySlideInExtension(iframeSelector)
    verifyEntrySlideInUrl(Constants.entries.testImageWrapper, currentEntryId)
  })
}
