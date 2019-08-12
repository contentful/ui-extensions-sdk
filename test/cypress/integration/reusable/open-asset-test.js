import { asset } from '../../utils/paths'
import * as Constants from '../../../constants'

export function openAssetExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openAsset(Constants.assets.testImage)
  })
}

export function openAssetSlideInExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openAsset(Constants.assets.testImage, {
      slideIn: true
    })
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

export function openAssetTest(iframeSelector) {
  it('opens asset using sdk.navigator.openAsset', () => {
    openAssetExtension(iframeSelector)
    verifyAssetPageUrl(Constants.assets.testImage)
  })
}

export function openAssetSlideInTest(iframeSelector, currentEntryId) {
  it('opens asset using sdk.navigator.openAsset (slideIn)', () => {
    openAssetSlideInExtension(iframeSelector)
    verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
  })
}
