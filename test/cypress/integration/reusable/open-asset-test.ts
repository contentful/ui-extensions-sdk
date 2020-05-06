import { asset } from '../../utils/paths'
import * as Constants from '../../../constants'

export function openAssetExtension(iframeSelector) {
  return cy
    .getSdk(iframeSelector)
    .then(sdk => {
      sdk.navigator.openAsset(Constants.assets.testImage)
    })
    .then(cy.wrap)
}

export function openAssetSlideInExtension(iframeSelector, done) {
  return cy.getSdk(iframeSelector).then(sdk => {
    sdk.navigator
      .openAsset(Constants.assets.testImage, {
        slideIn: true
      })
      .then(done)
  })
}

export function openAssetSlideInWaitExtension(iframeSelector, done) {
  return cy.getSdk(iframeSelector).then(sdk => {
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
    openAssetExtension(iframeSelector).then(() => {
      verifyAssetPageUrl(Constants.assets.testImage)
    })
  })
}

export function openAssetSlideInTest(iframeSelector, currentEntryId) {
  function clickSlideInClose() {
    return cy
      .get('[data-test-id="slide-in-layer"] [data-test-id="breadcrumbs-back-btn"]')
      .then($element => $element.click())
      .then(cy.wrap)
  }

  it('opens asset using sdk.navigator.openAsset (slideIn = true)', () => {
    let closeClicked = false

    // callback should be called right after slide in is opened
    openAssetSlideInExtension(iframeSelector, result => {
      expect(result.navigated).to.be.equal(true)
      expect(closeClicked).to.be.equal(false)
    }).then(() => {
      verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
      clickSlideInClose().then(() => {
        closeClicked = true
      })
    })
  })

  it('opens asset using sdk.navigator.openAsset (slideIn = { waitForClose: true })', () => {
    let closeClicked = false

    // callback should be called only after slide in is closed
    openAssetSlideInWaitExtension(iframeSelector, result => {
      expect(result.navigated).to.be.equal(true)
      expect(closeClicked).to.be.equal(true)
    }).then(() => {
      verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
      clickSlideInClose().then(() => {
        closeClicked = true
      })
    })
  })
}
