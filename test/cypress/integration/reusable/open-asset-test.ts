import { asset } from '../../utils/paths'
import * as Constants from '../../../constants'

export function openAssetExtension(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator.openAsset(Constants.assets.testImage)
  })
}

export function _openAssetSlideInExtension(iframeSelector, done) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator
      .openAsset(Constants.assets.testImage, {
        slideIn: true
      })
      .then(done)
  })
}

export function openAssetSlideInExtension(iframeSelector) {
  return cy.getSdk(iframeSelector).then(sdk =>
    sdk.navigator
      .openAsset(Constants.assets.testImage, {
        slideIn: true
      })
      .then(cy.wrap)
  )
}

export function openAssetSlideInWaitExtension(iframeSelector, done) {
  cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator
      .openAsset(Constants.assets.testImage, {
        slideIn: { waitForClose: true }
      })
      .then(done)
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
  function clickSlideInClose() {
    return cy.get('[data-test-id="slide-in-layer"] [data-test-id="breadcrumbs-back-btn"]').click()
  }

  it('opens asset using sdk.navigator.openAsset (slideIn = true)', () => {
    let closeClicked = false

    openAssetSlideInExtension(iframeSelector).then(result => {
      expect(result.navigated).to.be.equal(true)
      expect(closeClicked).to.be.equal(false)
      verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
      clickSlideInClose().then(() => {
        closeClicked = true
      })
    })
  })

  it('opens asset using sdk.navigator.openAsset (slideIn = { waitForClose: true })', done => {
    let closeClicked = false

    // callback should be called only after slide in is closed
    openAssetSlideInWaitExtension(iframeSelector, result => {
      expect(result.navigated).to.be.equal(true)
      expect(closeClicked).to.be.equal(true)
      done()
    })

    verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
    clickSlideInClose().then(() => {
      closeClicked = true
    })
  })
}
