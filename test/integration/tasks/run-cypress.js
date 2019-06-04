const runScript = require('../run-script')

module.exports = async () => {
  await runScript('./node_modules/.bin/cypress', ['run'])
}
