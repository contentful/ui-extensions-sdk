import { entry } from '../../utils/paths'
import * as Constants from '../../../constants'

export function clickToOpenEntry({ slideIn } = { slideIn: false }) {
  cy.get('@extension').within(() => {
    cy.getByTestId(
      slideIn ? Constants.actionSelectors.openEntrySlideIn : Constants.actionSelectors.openEntry
    ).click()
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

export function openEntryTest() {
  it('opens entry using sdk.navigator.openEntry', () => {
    clickToOpenEntry()
    verifyEntryPageUrl(Constants.entries.testImageWrapper)
  })
}

export function openEntrySlideInTest(currentEntryId) {
  it('opens entry using sdk.navigator.openEntry (slideIn)', () => {
    clickToOpenEntry({
      slideIn: true
    })
    verifyEntrySlideInUrl(Constants.entries.testImageWrapper, currentEntryId)
  })
}
