import runScript from '../run-script'
import { printStepTitle } from '../utils'

export default async (role: string, initializeTestOnly: boolean = false) => {
  printStepTitle(`${role}: Runnings tests...`)
  const args = ['run', '--browser', 'chrome']
  if (initializeTestOnly) {
    args.push('--spec', 'test/cypress/integration/initialize.spec.ts')
  }
  // } else if (process.env.TEST) {
  //   console.log('Testing the following test files: ', process.env.TEST.split(/\s/).join(','))
  //   // allow circle to pick a subset of test files
  //   args.push('--spec', process.env.TEST.split(/\s/).join(','))
  // } else {
  //   // otherwise default
  //   console.log('Using default glob')
  //   args.push('--spec', 'test/cypress/integration/**/*.spec.[jt]s')
  // }
  await runScript('./node_modules/.bin/cypress', args)
}
