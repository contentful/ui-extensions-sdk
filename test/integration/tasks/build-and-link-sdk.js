const runScript = require('../run-script')

module.exports = async () => {
  await runScript('npm', ['install', '--silent'])
  await runScript('npm', ['run', 'build'])
  await runScript('npm', ['link'])
}
