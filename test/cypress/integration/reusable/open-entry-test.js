import { entry } from '../../utils/paths'
import * as Constants from '../../../constants'

export function openEntryExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openEntry(Constants.entries.testImageWrapper)
  })
}

export function openEntrySlideInExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openEntry(Constants.entries.testImageWrapper, {
      slideIn: true
    })
  })
}

export function verifyEntryPageUrl(entryId) {
  cy.url().should('eq', Cypress.config().baseUrl + entry(entryId))
}

export function verifyEntrySlideInUrl(entryId, previousEntryId) {
  cy.url().should(
    'eq',
    Cypress.config().baseUrl + entry(entryId) + `?previousEntries=${previousEntryId}`
  )
}

export function openEntryTest(iframeSelector) {
  it('opens entry using sdk.navigator.openEntry', () => {
    openEntryExtension(iframeSelector)
    verifyEntryPageUrl(Constants.entries.testImageWrapper)
  })
}

export function openEntrySlideInTest(iframeSelector, currentEntryId) {
  it('opens entry using sdk.navigator.openEntry (slideIn)', () => {
    openEntrySlideInExtension(iframeSelector)
    verifyEntrySlideInUrl(Constants.entries.testImageWrapper, currentEntryId)
  })
}
