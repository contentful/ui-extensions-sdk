const runScript = require('../run-script')

module.exports = async ({ testLocalSdk }) => {
  await runScript('npm', [
    'install',
    '--prefix',
    'test-extensions/test-field-extension',
    '--silent'
  ])
  if (testLocalSdk) {
    await runScript('npm', ['link', 'contentful-ui-extensions-sdk'])
  }
  await runScript('npm', ['run', 'deploy', '--prefix', 'test-extensions/test-field-extension'])
}
