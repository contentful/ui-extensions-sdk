const runScript = require('../run-script')
const printStepTitle = require('../utils').printStepTitle

module.exports = async () => {
  printStepTitle('Runnings tests...')
  await runScript('./node_modules/.bin/cypress', [
    'run',
    '--browser',
    'chrome',
    '--reporter',
    'mochawesome'
  ])
}
