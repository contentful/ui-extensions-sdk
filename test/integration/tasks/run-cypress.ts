import runScript from '../run-script'
import { printStepTitle } from '../utils'

export default async (role: string, initializeTestOnly: boolean = false) => {
  printStepTitle(`${role}: Runnings tests...`)
  const args = ['run', '--browser', 'chrome', '--parallel', '--record', '--key=uie-integration']
  if (initializeTestOnly) {
    args.push('--spec', 'test/cypress/integration/initialize.spec.ts')
  }
  await runScript('./node_modules/.bin/cypress', args)
}
