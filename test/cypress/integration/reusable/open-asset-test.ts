import { asset } from '../../utils/paths'
import * as Constants from '../../../constants'

export function openAssetExtension(iframeSelector: string) {
  cy.getSdk(iframeSelector).then((sdk) => {
    sdk.navigator.openAsset(Constants.assets.testImage)
  })
}

export function openAssetSlideInExtension(iframeSelector: string) {
  return cy.getSdk(iframeSelector).then((sdk) =>
    sdk.navigator
      .openAsset(Constants.assets.testImage, {
        slideIn: true,
      })
      .then(cy.wrap)
  )
}

export function openAssetSlideInWaitExtension(iframeSelector: string, done: Function) {
  cy.getSdk(iframeSelector).then((sdk) => {
    sdk.navigator
      .openAsset(Constants.assets.testImage, {
        slideIn: { waitForClose: true },
      })
      .then(done)
  })
}

export function verifyAssetPageUrl(assetId: string) {
  cy.url().should('eq', Cypress.config().baseUrl + asset(assetId))
}

export function verifyAssetSlideInUrl(assetId: string, previousEntryId: string) {
  cy.url().should(
    'eq',
    Cypress.config().baseUrl + asset(assetId) + `?previousEntries=${previousEntryId}`
  )
}

export function openAssetTest(iframeSelector: string) {
  it('opens asset using sdk.navigator.openAsset', () => {
    openAssetExtension(iframeSelector)
    verifyAssetPageUrl(Constants.assets.testImage)
  })
}

export function openAssetSlideInTest(iframeSelector: string, currentEntryId: string) {
  function clickSlideInClose() {
    return cy.get('[data-test-id="slide-in-layer"] [data-test-id="workbench-back-btn"]').click()
  }

  it('opens asset using sdk.navigator.openAsset (slideIn = true)', () => {
    openAssetSlideInExtension(iframeSelector).then((result) => {
      expect(result.navigated).to.be.equal(true)
      cy.get('[data-test-id="slide-in-layer"]').should('not.be.visible')
      verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
      clickSlideInClose()
    })
  })

  it('opens asset using sdk.navigator.openAsset (slideIn = { waitForClose: true })', (done) => {
    // callback should be called only after slide in is closed
    openAssetSlideInWaitExtension(iframeSelector, (result: any) => {
      expect(result.navigated).to.be.equal(true)
      cy.get('[data-test-id="slide-in-layer"]').should('not.be.visible')
      done()
    })

    verifyAssetSlideInUrl(Constants.assets.testImage, currentEntryId)
    clickSlideInClose()
  })
}
