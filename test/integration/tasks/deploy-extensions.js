const runScript = require('../run-script')
const printStepTitle = require('../utils').printStepTitle

module.exports = async () => {
  printStepTitle('Deploy extensions to a new environment')
  await runScript('npm', ['run', 'deploy', '--prefix', 'test/extensions/test-field-extension'])
  await runScript('npm', ['run', 'deploy', '--prefix', 'test/extensions/test-page-extension'])
}
