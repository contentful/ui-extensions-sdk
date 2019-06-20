const runScript = require('../run-script')
const printStepTitle = require('../utils').printStepTitle

module.exports = async ({ testLocalSdk }) => {
  async function buildExtension(extensionId) {
    printStepTitle('Build extensions')
    await runScript('npm', ['install', '--prefix', `test/extensions/${extensionId}`, '--silent'])
    if (testLocalSdk) {
      printStepTitle('Linking local copy of ui-extension-sdk to extensions')
      await runScript('npm', ['link', './', '--prefix', `test/extensions/${extensionId}`])
    }
  }

  ;['test-field-extension', 'test-page-extension'].forEach(buildExtension)
}
