import runScript from '../run-script'
import { printStepTitle } from '../utils'

export default async () => {
  printStepTitle('Deploy extensions to a new environment')

  async function runExtensionScript(extensionId) {
    await runScript('npm', ['run', 'deploy', '--prefix', `test/extensions/${extensionId}`])
  }

  await Promise.all(['test-extension'].map(runExtensionScript))
}
