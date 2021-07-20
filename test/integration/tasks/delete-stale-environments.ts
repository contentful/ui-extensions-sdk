import { EnvironmentProps } from 'contentful-management/types'
import { plainClient } from '../contentful-client'
import { printStepTitle } from '../utils'

const TWO_HOURS_IN_MS = 60 * 60 * 2 * 1000

export default async (client = plainClient) => {
  printStepTitle('Removing stale environments')

  const environmentCollection = await client.environment.getMany({})
  const { items: environments } = environmentCollection

  // filter for relevant environments
  const isProtected = (environment: EnvironmentProps) =>
    environment.name === 'master' || environment.name.includes('test')

  const isStaleEnvironment = (environment: EnvironmentProps) => {
    const environmentDate = new Date(environment.sys.createdAt).getTime()
    const difference = Date.now() - environmentDate
    return difference >= TWO_HOURS_IN_MS
  }

  const promiseResults = await Promise.allSettled(
    environments
      .filter((environment) => !isProtected(environment))
      .filter((environment) => isStaleEnvironment(environment))
      .map(async (environment) => {
        const id = environment.sys.id

        try {
          await client.environment.delete({ environmentId: id })
          console.log(`Deleted environment ${id}`)
          return id
        } catch (error) {
          console.error(`Could not delete environment ${id}`)
        }
      })
  )

  return promiseResults
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map((r) => r.value)
}
