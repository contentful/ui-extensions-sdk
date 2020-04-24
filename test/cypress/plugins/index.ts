export default (on: Cypress.PluginEvents) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      // Workaround for https://github.com/cypress-io/cypress/issues/136
      // You cannot target elements or interact with anything in an iframe
      launchOptions.args.push('--disable-site-isolation-trials')
    }
  })
}
