export default on => {
  on('before:browser:launch', (browser = { name: '' }, launchOptions: { args: string[] }) => {
    if (browser.name === 'chrome') {
      // Workaround for https://github.com/cypress-io/cypress/issues/136
      // You cannot target elements or interact with anything in an iframe
      launchOptions.args.push('--disable-site-isolation-trials')
    }
  })
}
