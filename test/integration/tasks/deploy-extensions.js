const runScript = require('../run-script')
const printStepTitle = require('../utils').printStepTitle

module.exports = async () => {
  printStepTitle('Deploy extensions to a new environment')

  async function runExtensionScript(extensionId) {
    await runScript('npm', ['run', 'deploy', '--prefix', `test/extensions/${extensionId}`])
  }

  ;['test-field-extension', 'test-page-extension'].forEach(runExtensionScript)
}
