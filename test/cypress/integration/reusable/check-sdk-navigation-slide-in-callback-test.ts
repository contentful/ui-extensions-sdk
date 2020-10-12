import * as Constants from '../../../constants'

export function checkSdkNavigationSlideInCallbackTest(iframeSelector: any) {
  it('sdk.navigator.onSlideInNavigation is called when slide-in editor is opened and when it is closed', () => {
    cy.getSdk(iframeSelector).then(async sdk => {
      const spy = cy.stub()
      sdk.navigator.onSlideInNavigation(spy)
      await sdk.navigator.openEntry(Constants.entries.testImageWrapper, {
        slideIn: true
      })
      expect(spy).to.be.calledOnce
      expect(spy).to.be.calledWith({ newSlideLevel: 1, oldSlideLevel: 0 })
    })
  })
}
