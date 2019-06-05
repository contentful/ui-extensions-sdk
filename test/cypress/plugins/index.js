module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      // Workaround for https://github.com/cypress-io/cypress/issues/136
      // You cannot target elements or interact with anything in an iframe
      args.push('--disable-site-isolation-trials')
      return args
    }
  })
}
