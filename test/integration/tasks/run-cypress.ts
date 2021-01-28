import runScript from '../run-script'
import { printStepTitle } from '../utils'

export default async (role: string) => {
  printStepTitle(`${role}: Runnings tests...`)
  await runScript('./node_modules/.bin/cypress', ['run', '--browser', 'chrome'])
}
