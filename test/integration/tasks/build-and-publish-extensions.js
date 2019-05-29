const runScript = require('../run-script')

module.exports = async () => {
  await runScript('npm', [
    'install',
    '--prefix',
    'test-extensions/test-field-extension',
    '--silent'
  ])
  await runScript('npm', ['run', 'deploy', '--prefix', 'test-extensions/test-field-extension'])
}
