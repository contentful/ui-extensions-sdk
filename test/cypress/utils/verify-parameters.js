const parameters = require('../integration/fixtures/parameters.json')

export function verifySdkInstallationParameters(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(Object.keys(sdk.parameters.installation)).to.have.length(2)
    expect(sdk.parameters.installation).to.deep.equal(parameters.installation)
  })
}

export function verifySdkInstanceParameters(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(Object.keys(sdk.parameters.instance)).to.have.length(2)
    expect(sdk.parameters.instance).to.deep.equal(parameters.instance)
  })
}

export function verifySdkInvocationParameters(iframeSelector) {
  cy.getSdk(iframeSelector).then(sdk => {
    expect(Object.keys(sdk.parameters.invocation)).to.have.length(2)
    expect(sdk.parameters.invocation).to.deep.equal(parameters.invocation)
  })
}
