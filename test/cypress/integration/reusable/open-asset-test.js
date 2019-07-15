import { asset } from '../../utils/paths'
import * as Constants from '../../../constants'

export function clickToOpenAsset({ slideIn } = { slideIn: false }) {
  cy.get('@extension').within(() => {
    cy.getByTestId(
      slideIn ? Constants.actionSelectors.openAssetSlideIn : Constants.actionSelectors.openAsset
    ).click()
  })
}

export function verifyAssetPageUrl(assetId) {
  cy.url().should('eq', Cypress.config().baseUrl + asset(assetId))
}

export function verifyAssetSlideInUrl(assetId, previousEntryId) {
  cy.url().should(
    'eq',
    Cypress.config().baseUrl + asset(assetId) + `?previousEntries=${previousEntryId}`
  )
}

export function openAssetTest() {
  it('opens asset using sdk.navigator.openAsset', () => {
    clickToOpenAsset()
    verifyAssetPageUrl(Constants.assets.testImage)
  })
}

export function openAssetSlideInTest(currentEntryId) {
  it('opens asset using sdk.navigator.openAsset (slideIn)', () => {
    clickToOpenAsset({
      slideIn: true
    })
    verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
  })
}
