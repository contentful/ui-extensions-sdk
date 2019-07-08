const runScript = require('../run-script')
const printStepTitle = require('../utils').printStepTitle

module.exports = async ({ testLocalSdk }) => {
  printStepTitle('Build extensions')

  async function buildExtension(extensionId) {
    await runScript('npm', ['install', '--prefix', `test/extensions/${extensionId}`, '--silent'])

    if (testLocalSdk) {
      printStepTitle('Linking local copy of ui-extension-sdk to extensions')
      await runScript('npm', ['link', './', '--prefix', `test/extensions/${extensionId}`])
    }
  }

  await Promise.all(['test-extension'].map(buildExtension))
}
