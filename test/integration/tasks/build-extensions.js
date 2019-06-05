const runScript = require('../run-script')
const printStepTitle = require('../utils').printStepTitle

module.exports = async ({ testLocalSdk }) => {
  printStepTitle('Build extensions')
  await runScript('npm', [
    'install',
    '--prefix',
    'test-extensions/test-field-extension',
    '--silent'
  ])
  if (testLocalSdk) {
    printStepTitle('Linking local copy of ui-extension-sdk to extensions')
    await runScript('npm', ['link', './', '--prefix', 'test-extensions/test-field-extension'])
  }
}
