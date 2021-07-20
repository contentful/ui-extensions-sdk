import { plainClient } from '../contentful-client'
import { printStepTitle, sleep } from '../utils'

const TWO_HOURS_IN_MS = 60 * 60 * 2 * 1000

export default async (client = plainClient) => {
  printStepTitle('Removing stale environments')

  const environmentCollection = await client.environment.getMany({})
  const { items: environments } = environmentCollection

  // filter for relevant environments
  const isProtected = (name: string) => name === 'master' || name.includes('test')

  const isStaleEnvironment = (timeStamp: string) => {
    const environmentDate = new Date(timeStamp).getTime()
    const difference = Date.now() - environmentDate
    return difference >= TWO_HOURS_IN_MS
  }
  const deletedEnvironmentIds: string[] = []

  for (const environment of environments) {
    const {
      name,
      sys: { createdAt, id },
    } = environment
    if (isProtected(name) || !isStaleEnvironment(createdAt)) {
      continue
    }

    try {
      await client.environment.delete(id)
      deletedEnvironmentIds.push(id)
      console.log(`Deleted environment ${id}`)
      await sleep(200)
    } catch (error) {
      console.error(`Could not delete environment ${environment.sys.id}`)
    }
  }

  return deletedEnvironmentIds
}
