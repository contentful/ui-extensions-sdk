module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--disable-site-isolation-trials')
      return args
    }
  })
}
