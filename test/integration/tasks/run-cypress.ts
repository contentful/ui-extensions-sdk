import runScript from '../run-script'
import { printStepTitle } from '../utils'

export default async (
  role: string,
  options?: { initializeTestOnly?: boolean; permissionTestOnly?: boolean }
) => {
  printStepTitle(`${role}: Runnings tests...`)
  const args = ['run', '--browser', 'chrome']
  if (options?.initializeTestOnly) {
    args.push('--spec', 'test/cypress/integration/initialize.spec.ts')
  }
  if (options?.permissionTestOnly) {
    args.push('--spec', 'test/cypress/integration/entry-editor-permission.spec.ts')
  }
  await runScript('./node_modules/.bin/cypress', args)
}
