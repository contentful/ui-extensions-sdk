import deleteEnvironment from './tasks/delete-new-environment'
import asyncRetry from 'async-retry'

const environmentId = Cypress.env('activeEnvironmentId')

const cleanup = async () => {
  if (environmentId) {
    try {
      await asyncRetry(
        () => {
          return deleteEnvironment(environmentId)
        },
        { retries: 3 }
      )
    } catch (e) {
      console.log(e)
      throw new Error('Failed to remove environment')
    }
  }
}
;(async function main() {
  try {
    await cleanup()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
